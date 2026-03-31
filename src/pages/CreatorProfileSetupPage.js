import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const CREATOR_TYPE_OPTIONS = [
  'Visual Artist',
  'Photographer',
  'Boudoir Photographer',
  'Film Creator',
  'Music Creator',
  'Writer',
  'Scriptwriter',
  'Creative Director',
];

export default function CreatorProfileSetupPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    creator_slug: '',
    bio: '',
    location: '',
    creator_types: [],
    custom_creator_type: '',
    is_available_for_collab: false,
    is_available_for_client_work: false,
    show_in_creator_directory: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    setMessage('');

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      setMessage('You must be logged in to access creator profile setup.');
      setLoading(false);
      return;
    }

    setUser(currentUser);

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        is_creator,
        display_name,
        username,
        creator_slug,
        bio,
        location,
        creator_types,
        custom_creator_type,
        is_available_for_collab,
        is_available_for_client_work,
        show_in_creator_directory
      `)
      .eq('id', currentUser.id)
      .single();

    if (error) {
      setMessage('Could not load your creator profile.');
      setLoading(false);
      return;
    }

    setIsCreator(!!data.is_creator);

    setFormData({
      display_name: data.display_name || '',
      username: data.username || '',
      creator_slug: data.creator_slug || '',
      bio: data.bio || '',
      location: data.location || '',
      creator_types: data.creator_types || [],
      custom_creator_type: data.custom_creator_type || '',
      is_available_for_collab: !!data.is_available_for_collab,
      is_available_for_client_work: !!data.is_available_for_client_work,
      show_in_creator_directory: !!data.show_in_creator_directory,
    });

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleCreatorTypeToggle(typeValue) {
    setFormData((prev) => {
      const alreadySelected = prev.creator_types.includes(typeValue);

      if (alreadySelected) {
        return {
          ...prev,
          creator_types: prev.creator_types.filter((item) => item !== typeValue),
        };
      }

      return {
        ...prev,
        creator_types: [...prev.creator_types, typeValue],
      };
    });
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function handleSlugAutoGenerate() {
    const source = formData.display_name || formData.username;
    if (!source) return;

    setFormData((prev) => ({
      ...prev,
      creator_slug: slugify(source),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (!user) {
      setMessage('No logged-in user found.');
      setSaving(false);
      return;
    }

    if (!isCreator) {
      setMessage('Only creator accounts can use this page.');
      setSaving(false);
      return;
    }

    if (!formData.display_name.trim()) {
      setMessage('Display name is required.');
      setSaving(false);
      return;
    }

    if (!formData.username.trim()) {
      setMessage('Username is required.');
      setSaving(false);
      return;
    }

    if (!formData.creator_slug.trim()) {
      setMessage('Creator slug is required.');
      setSaving(false);
      return;
    }

    const cleanedUsername = formData.username.trim().toLowerCase();
    const cleanedSlug = slugify(formData.creator_slug);

    const payload = {
      display_name: formData.display_name.trim(),
      username: cleanedUsername,
      creator_slug: cleanedSlug,
      bio: formData.bio.trim(),
      location: formData.location.trim(),
      creator_types: formData.creator_types,
      custom_creator_type: formData.custom_creator_type.trim(),
      is_available_for_collab: formData.is_available_for_collab,
      is_available_for_client_work: formData.is_available_for_client_work,
      show_in_creator_directory: formData.show_in_creator_directory,
    };

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id);

    if (error) {
      if (error.message?.toLowerCase().includes('username')) {
        setMessage('That username is already taken.');
      } else if (error.message?.toLowerCase().includes('creator_slug')) {
        setMessage('That creator slug is already taken.');
      } else {
        setMessage('Could not save your creator profile.');
      }
      setSaving(false);
      return;
    }

    setMessage('Creator profile saved successfully.');
    setSaving(false);
  }

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <h1>Creator Profile Setup</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '24px' }}>
        <h1>Creator Profile Setup</h1>
        <p>You must be logged in to access this page.</p>
        {message && <p>{message}</p>}
      </div>
    );
  }

  if (!isCreator) {
    return (
      <div style={{ padding: '24px' }}>
        <h1>Creator Profile Setup</h1>
        <p>Your account is not currently set as a creator account.</p>
        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h1>Creator Profile Setup</h1>
      <p>Set up your public creator identity for discovery on The Aset Studio.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
        <div>
          <label>Display Name</label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </div>

        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="jessicamonroe"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </div>

        <div>
          <label>Creator Slug</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <input
              type="text"
              name="creator_slug"
              value={formData.creator_slug}
              onChange={handleChange}
              placeholder="jessica-monroe"
              style={{ flex: 1, padding: '10px' }}
            />
            <button type="button" onClick={handleSlugAutoGenerate}>
              Auto Generate
            </button>
          </div>
        </div>

        <div>
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={5}
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Atlanta, GA"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </div>

        <div>
          <label>Creator Types</label>
          <div style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
            {CREATOR_TYPE_OPTIONS.map((typeValue) => (
              <label key={typeValue} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={formData.creator_types.includes(typeValue)}
                  onChange={() => handleCreatorTypeToggle(typeValue)}
                />
                {typeValue}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Custom Creator Type</label>
          <input
            type="text"
            name="custom_creator_type"
            value={formData.custom_creator_type}
            onChange={handleChange}
            placeholder="AI Concept Designer"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </div>

        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="checkbox"
            name="is_available_for_collab"
            checked={formData.is_available_for_collab}
            onChange={handleChange}
          />
          Available for Collaboration
        </label>

        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="checkbox"
            name="is_available_for_client_work"
            checked={formData.is_available_for_client_work}
            onChange={handleChange}
          />
          Available for Client Work
        </label>

        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="checkbox"
            name="show_in_creator_directory"
            checked={formData.show_in_creator_directory}
            onChange={handleChange}
          />
          Show my profile in the Creator Directory
        </label>

        <button type="submit" disabled={saving} style={{ padding: '12px 16px' }}>
          {saving ? 'Saving...' : 'Save Creator Profile'}
        </button>

        {message && <p style={{ marginTop: '8px' }}>{message}</p>}
      </form>
    </div>
  );
}
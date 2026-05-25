import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function BrickAdminPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [savingCharacter, setSavingCharacter] = useState(false);
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [role, setRole] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [bio, setBio] = useState('');
  const [personality, setPersonality] = useState('');
  const [quote, setQuote] = useState('');
  const [status, setStatus] = useState('draft');
  const [featured, setFeatured] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchCharacters();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!slug.trim() && name.trim()) {
      setSlug(slugify(name));
    }
  }, [name, slug]);

  async function checkAdminAccess() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setIsAdmin(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Brick admin access failed:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAccess(false);
    }
  }

  async function fetchCharacters() {
    setLoadingCharacters(true);

    try {
      const { data, error } = await supabase
        .from('brick_characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const withPreviewUrls = await Promise.all(
        (data || []).map(async (item) => {
          if (!item.image_path) return { ...item, preview_url: '' };

          const { data: signed, error: signedError } = await supabase.storage
            .from('media')
            .createSignedUrl(item.image_path, 60 * 60);

          if (signedError) {
            console.error('Brick character signed URL error:', signedError);
            return { ...item, preview_url: '' };
          }

          return { ...item, preview_url: signed?.signedUrl || '' };
        })
      );

      setCharacters(withPreviewUrls);
    } catch (error) {
      console.error('Error fetching Brick characters:', error);
    } finally {
      setLoadingCharacters(false);
    }
  }

  async function handleCharacterSubmit(event) {
    event.preventDefault();
    setMessage('');

    const cleanName = name.trim();
    const cleanSlug = slugify(slug || name);

    if (!cleanName || !cleanSlug) {
      setMessage('Character name and slug are required.');
      return;
    }

    setSavingCharacter(true);

    try {
      let imagePath = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const safeFileName = `brick-character-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;

        imagePath = `brick-by-brick/characters/${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(imagePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;
      }

      const payload = {
        name: cleanName,
        slug: cleanSlug,
        role: role.trim() || null,
        family_name: familyName.trim() || null,
        bio: bio.trim() || null,
        personality: personality.trim() || null,
        quote: quote.trim() || null,
        status,
        image_path: imagePath,
        featured,
        hidden,
      };

      const { error } = await supabase.from('brick_characters').insert([payload]);

      if (error) throw error;

      setName('');
      setSlug('');
      setRole('');
      setFamilyName('');
      setBio('');
      setPersonality('');
      setQuote('');
      setStatus('draft');
      setFeatured(false);
      setHidden(false);
      setImageFile(null);

      const fileInput = document.getElementById('brick-character-image-input');
      if (fileInput) fileInput.value = '';

      setMessage('Character added successfully.');
      await fetchCharacters();
    } catch (error) {
      console.error('Character save failed:', error);
      setMessage(error.message || 'Character save failed.');
    } finally {
      setSavingCharacter(false);
    }
  }

  async function updateCharacter(id, updates) {
    try {
      const { error } = await supabase
        .from('brick_characters')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchCharacters();
    } catch (error) {
      console.error('Character update failed:', error);
      alert(error.message || 'Could not update character.');
    }
  }

  async function deleteCharacter(item) {
    const confirmed = window.confirm(`Delete ${item.name}?`);
    if (!confirmed) return;

    try {
      if (item.image_path) {
        const { error: storageError } = await supabase.storage
          .from('media')
          .remove([item.image_path]);

        if (storageError) console.error('Character image delete failed:', storageError);
      }

      const { error } = await supabase
        .from('brick_characters')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      await fetchCharacters();
    } catch (error) {
      console.error('Character delete failed:', error);
      alert(error.message || 'Could not delete character.');
    }
  }

  if (checkingAccess) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.pageTitle}>Brick by Brick Admin</h1>
          <p style={styles.mutedText}>Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.pageTitle}>Brick by Brick Admin</h1>
          <p style={styles.errorText}>You do not have access to this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <p style={styles.kicker}>The Aset Studio Original Series</p>
        <h1 style={styles.pageTitle}>Brick by Brick Admin</h1>
        <p style={styles.mutedText}>
          Build the character bible, manage the Bellaire world, and prepare the series channel with controlled studio precision.
        </p>
      </div>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Add Character</h2>

        <form onSubmit={handleCharacterSubmit} style={styles.form}>
          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Character Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="Example: Sasha Bellaire"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="sasha-bellaire"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Example: Daughter of Horace Bellaire"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Family / Organization</label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="Example: Bellaire Family"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Character Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write the character's story, power position, secrets, and series purpose."
              rows={6}
              style={styles.textarea}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Personality</label>
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Example: controlled, sharp, seductive in strategy, emotionally guarded..."
              rows={4}
              style={styles.textarea}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Signature Quote</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Optional quote for the character card."
              rows={3}
              style={styles.textarea}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Character Image</label>
            <input
              id="brick-character-image-input"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              style={styles.fileInput}
            />
          </div>

          <div style={styles.threeColumnGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.select}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Featured</label>
              <select
                value={featured ? 'true' : 'false'}
                onChange={(e) => setFeatured(e.target.value === 'true')}
                style={styles.select}
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Hidden</label>
              <select
                value={hidden ? 'true' : 'false'}
                onChange={(e) => setHidden(e.target.value === 'true')}
                style={styles.select}
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </select>
            </div>
          </div>

          <button type="submit" style={styles.primaryButton} disabled={savingCharacter}>
            {savingCharacter ? 'Saving Character...' : 'Add Character'}
          </button>

          {message ? (
            <p
              style={
                message.toLowerCase().includes('failed') ||
                message.toLowerCase().includes('required') ||
                message.toLowerCase().includes('duplicate')
                  ? styles.errorText
                  : styles.successText
              }
            >
              {message}
            </p>
          ) : null}
        </form>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Character Bible</h2>

        {loadingCharacters ? (
          <p style={styles.mutedText}>Loading characters...</p>
        ) : characters.length === 0 ? (
          <p style={styles.mutedText}>No Brick by Brick characters yet.</p>
        ) : (
          <div style={styles.characterGrid}>
            {characters.map((item) => (
              <div key={item.id} style={styles.characterCard}>
                {item.preview_url ? (
                  <img src={item.preview_url} alt={item.name} style={styles.characterImage} />
                ) : (
                  <div style={styles.imagePlaceholder}>No Image</div>
                )}

                <div style={styles.badgeRow}>
                  <span style={styles.badge}>{item.status || 'draft'}</span>
                  {item.featured ? <span style={styles.goldBadge}>Featured</span> : null}
                  {item.hidden ? <span style={styles.darkBadge}>Hidden</span> : null}
                </div>

                <h3 style={styles.characterName}>{item.name}</h3>
                <p style={styles.characterSlug}>/{item.slug}</p>

                {item.role ? <p style={styles.characterMeta}>{item.role}</p> : null}
                {item.family_name ? <p style={styles.characterMeta}>{item.family_name}</p> : null}
                {item.bio ? <p style={styles.bodyText}>{item.bio}</p> : null}
                {item.personality ? (
                  <p style={styles.bodyText}>
                    <strong>Personality:</strong> {item.personality}
                  </p>
                ) : null}
                {item.quote ? <p style={styles.quote}>“{item.quote}”</p> : null}

                <div style={styles.actionRow}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() =>
                      updateCharacter(item.id, {
                        status: item.status === 'published' ? 'draft' : 'published',
                      })
                    }
                  >
                    {item.status === 'published' ? 'Set Draft' : 'Publish'}
                  </button>

                  <button
                    type="button"
                    style={item.featured ? styles.goldButton : styles.secondaryButton}
                    onClick={() => updateCharacter(item.id, { featured: !item.featured })}
                  >
                    {item.featured ? 'Featured' : 'Feature'}
                  </button>

                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => updateCharacter(item.id, { hidden: !item.hidden })}
                  >
                    {item.hidden ? 'Unhide' : 'Hide'}
                  </button>

                  <button
                    type="button"
                    style={styles.dangerButton}
                    onClick={() => deleteCharacter(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '24px',
    background:
      'radial-gradient(circle at top, rgba(166, 120, 44, 0.16), transparent 34%), #07070a',
    color: '#f5f1e8',
  },
  headerCard: {
    background: 'rgba(18, 18, 24, 0.94)',
    border: '1px solid rgba(212, 175, 55, 0.28)',
    borderRadius: '20px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
  },
  kicker: {
    margin: '0 0 10px 0',
    color: '#d4af37',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    fontSize: '12px',
    fontWeight: 800,
  },
  pageTitle: {
    margin: 0,
    fontSize: '34px',
    fontWeight: 800,
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '24px',
    fontWeight: 800,
  },
  card: {
    background: 'rgba(16, 16, 22, 0.96)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '24px',
  },
  form: {
    display: 'grid',
    gap: '16px',
  },
  fieldGroup: {
    display: 'grid',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#e8ddc8',
  },
  input: {
    width: '100%',
    padding: '13px 14px',
    borderRadius: '12px',
    border: '1px solid #343444',
    background: '#09090d',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '13px 14px',
    borderRadius: '12px',
    border: '1px solid #343444',
    background: '#09090d',
    color: '#ffffff',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
    whiteSpace: 'pre-wrap',
  },
  select: {
    width: '100%',
    padding: '13px 14px',
    borderRadius: '12px',
    border: '1px solid #343444',
    background: '#09090d',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  fileInput: {
    width: '100%',
    padding: '13px 14px',
    borderRadius: '12px',
    border: '1px solid #343444',
    background: '#09090d',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  threeColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  primaryButton: {
    width: 'fit-content',
    padding: '13px 18px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #d4af37, #f4df9b)',
    color: '#111111',
    fontWeight: 900,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '11px 14px',
    borderRadius: '12px',
    border: '1px solid #3a3a49',
    background: '#1a1a23',
    color: '#ffffff',
    fontWeight: 800,
    cursor: 'pointer',
  },
  goldButton: {
    padding: '11px 14px',
    borderRadius: '12px',
    border: '1px solid #d4af37',
    background: '#d4af37',
    color: '#111111',
    fontWeight: 900,
    cursor: 'pointer',
  },
  dangerButton: {
    padding: '11px 14px',
    borderRadius: '12px',
    border: '1px solid #6f2832',
    background: '#34151b',
    color: '#ffffff',
    fontWeight: 800,
    cursor: 'pointer',
  },
  characterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
  },
  characterCard: {
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '18px',
    background: '#0d0d13',
    padding: '16px',
  },
  characterImage: {
    width: '100%',
    height: '320px',
    objectFit: 'cover',
    borderRadius: '16px',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    marginBottom: '12px',
    background: '#09090d',
  },
  imagePlaceholder: {
    width: '100%',
    height: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    border: '1px solid rgba(212, 175, 55, 0.18)',
    background: '#111119',
    color: '#8e8a80',
    marginBottom: '12px',
  },
  badgeRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  badge: {
    display: 'inline-flex',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#242431',
    color: '#f3f3f5',
    fontSize: '12px',
    fontWeight: 800,
  },
  goldBadge: {
    display: 'inline-flex',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#d4af37',
    color: '#111111',
    fontSize: '12px',
    fontWeight: 900,
  },
  darkBadge: {
    display: 'inline-flex',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#3a1d24',
    color: '#ffd8df',
    fontSize: '12px',
    fontWeight: 800,
  },
  characterName: {
    margin: '0 0 5px 0',
    fontSize: '22px',
    fontWeight: 900,
  },
  characterSlug: {
    margin: '0 0 10px 0',
    color: '#9a9488',
    fontSize: '13px',
  },
  characterMeta: {
    margin: '0 0 8px 0',
    color: '#d9c99d',
    fontWeight: 700,
  },
  bodyText: {
    margin: '0 0 10px 0',
    color: '#ded8ca',
    lineHeight: 1.55,
    whiteSpace: 'pre-wrap',
  },
  quote: {
    margin: '12px 0',
    color: '#c7bdac',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '14px',
  },
  mutedText: {
    color: '#b9b2a6',
    lineHeight: 1.6,
  },
  successText: {
    color: '#9fe3b0',
    margin: 0,
  },
  errorText: {
    color: '#ff9ea8',
    margin: 0,
  },
};
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';

const IMAGE_CATEGORIES = [
  'editorial',
  'boudoir',
  'portraits',
  'sirens realm',
  'aset lounge',
  'fashion',
  'beauty',
  'lifestyle',
  'storybook land',
];

const VIDEO_CATEGORIES = ['interview', 'hot_take', 'cinematic'];

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [loadingPrompts, setLoadingPrompts] = useState(true);
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [promptTitle, setPromptTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptCategory, setPromptCategory] = useState('');
  const [promptImageFile, setPromptImageFile] = useState(null);
  const [promptStatus, setPromptStatus] = useState('draft');

  const [loadingMedia, setLoadingMedia] = useState(true);
  const [savingMedia, setSavingMedia] = useState(false);
  const [mediaMessage, setMediaMessage] = useState('');
  const [mediaItems, setMediaItems] = useState([]);

  const [mediaType, setMediaType] = useState('image');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaSlug, setMediaSlug] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaTagline, setMediaTagline] = useState('');
  const [mediaQuote, setMediaQuote] = useState('');
  const [mediaCategory, setMediaCategory] = useState('');
  const [mediaSubcategory, setMediaSubcategory] = useState('');
  const [mediaCategoryMode, setMediaCategoryMode] = useState('existing');
  const [newMediaCategory, setNewMediaCategory] = useState('');
  const [mediaAccessLevel, setMediaAccessLevel] = useState('public');
  const [mediaStatus, setMediaStatus] = useState('published');
  const [mediaHidden, setMediaHidden] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchPrompts();
      fetchMediaItems();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!mediaSlug.trim() && mediaTitle.trim()) {
      setMediaSlug(slugify(mediaTitle));
    }
  }, [mediaTitle, mediaSlug]);

  async function checkAdminAccess() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error getting user:', userError);
        setIsAdmin(false);
        setCheckingAccess(false);
        return;
      }

      if (!user) {
        setIsAdmin(false);
        setCheckingAccess(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        setIsAdmin(false);
        setCheckingAccess(false);
        return;
      }

      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Admin access check failed:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAccess(false);
    }
  }

  async function fetchPrompts() {
    setLoadingPrompts(true);

    try {
      const { data, error } = await supabase
        .from('prompt_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const items = data || [];

      const withPreviewUrls = await Promise.all(
        items.map(async (item) => {
          if (!item.image_url) {
            return { ...item, preview_url: '' };
          }

          const { data: signed, error: signedError } = await supabase.storage
            .from('media')
            .createSignedUrl(item.image_url, 60 * 60);

          if (signedError) {
            console.error('Prompt signed URL error:', signedError);
            return { ...item, preview_url: '' };
          }

          return {
            ...item,
            preview_url: signed?.signedUrl || '',
          };
        })
      );

      setPrompts(withPreviewUrls);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoadingPrompts(false);
    }
  }

  async function fetchMediaItems() {
    setLoadingMedia(true);

    try {
      const { data, error } = await supabase
        .from('media_items')
        .select(
          'id, owner_id, title, slug, description, tagline, quote, file_path, watermarked_path, category, subcategory, status, hidden, access_level, type, created_at'
        )
        .order('created_at', { ascending: false })
        .limit(24);

      if (error) throw error;

      const items = data || [];

      const withUrls = await Promise.all(
        items.map(async (item) => {
          if (!item.file_path) {
            return { ...item, preview_url: '' };
          }

          const { data: signed, error: signedError } = await supabase.storage
            .from('media')
            .createSignedUrl(item.file_path, 60 * 60);

          if (signedError) {
            console.error('Signed URL error:', signedError);
            return { ...item, preview_url: '' };
          }

          return {
            ...item,
            preview_url: signed?.signedUrl || '',
          };
        })
      );

      setMediaItems(withUrls);
    } catch (error) {
      console.error('Error fetching media items:', error);
    } finally {
      setLoadingMedia(false);
    }
  }

  async function handlePromptSubmit(event) {
    event.preventDefault();
    setPromptMessage('');

    const cleanTitle = promptTitle.trim();
    const cleanPromptText = promptText.trim();
    const cleanCategory = promptCategory.trim();
    const cleanStatus = promptStatus === 'published' ? 'published' : 'draft';

    if (!cleanTitle || !cleanPromptText) {
      setPromptMessage('Title and prompt text are required.');
      return;
    }

    setSavingPrompt(true);

    try {
      let uploadedImagePath = null;

      if (promptImageFile) {
        const fileExt = promptImageFile.name.split('.').pop();
        const safeFileName = `prompt-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;
        const storagePath = `prompt-previews/${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(storagePath, promptImageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        uploadedImagePath = storagePath;
      }

      const payload = {
        title: cleanTitle,
        prompt_text: cleanPromptText,
        category: cleanCategory || null,
        image_url: uploadedImagePath,
        status: cleanStatus,
        published_at: cleanStatus === 'published' ? new Date().toISOString() : null,
      };

      const { error } = await supabase.from('prompt_library').insert([payload]);

      if (error) throw error;

      setPromptTitle('');
      setPromptText('');
      setPromptCategory('');
      setPromptImageFile(null);
      setPromptStatus('draft');
      setPromptMessage('Prompt uploaded successfully.');

      const promptFileInput = document.getElementById('admin-prompt-file-input');
      if (promptFileInput) promptFileInput.value = '';

      await fetchPrompts();
    } catch (error) {
      console.error('Prompt upload failed:', error);
      setPromptMessage(error.message || 'Prompt upload failed.');
    } finally {
      setSavingPrompt(false);
    }
  }

  async function handlePromptStatusChange(promptId, nextStatus) {
    try {
      const updates = {
        status: nextStatus,
        published_at: nextStatus === 'published' ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from('prompt_library')
        .update(updates)
        .eq('id', promptId);

      if (error) throw error;

      setPrompts((current) =>
        current.map((item) =>
          item.id === promptId
            ? {
                ...item,
                ...updates,
              }
            : item
        )
      );
    } catch (error) {
      console.error('Prompt status update failed:', error);
      alert(error.message || 'Could not update prompt status.');
    }
  }

  async function handleDeletePrompt(promptId) {
    const confirmed = window.confirm('Delete this prompt?');
    if (!confirmed) return;

    try {
      const promptToDelete = prompts.find((item) => item.id === promptId);

      const { error } = await supabase
        .from('prompt_library')
        .delete()
        .eq('id', promptId);

      if (error) throw error;

      if (promptToDelete?.image_url) {
        const { error: storageError } = await supabase.storage
          .from('media')
          .remove([promptToDelete.image_url]);

        if (storageError) {
          console.error('Prompt preview image delete failed:', storageError);
        }
      }

      setPrompts((current) => current.filter((item) => item.id !== promptId));
    } catch (error) {
      console.error('Prompt delete failed:', error);
      alert(error.message || 'Could not delete prompt.');
    }
  }

  async function handleMediaSubmit(event) {
    event.preventDefault();
    setMediaMessage('');

    if (!mediaFile) {
      setMediaMessage(`Please choose a ${mediaType} file.`);
      return;
    }

    const cleanTitle = mediaTitle.trim();
    const cleanDescription = mediaDescription.trim();
    const cleanTagline = mediaTagline.trim();
    const cleanQuote = mediaQuote.trim();
    const cleanSubcategory = mediaSubcategory.trim();
    const cleanSlug = slugify(mediaSlug || mediaTitle);
    const finalCategory =
      mediaCategoryMode === 'new' ? newMediaCategory.trim() : mediaCategory.trim();

    if (mediaCategoryMode === 'new' && !newMediaCategory.trim()) {
      setMediaMessage('Please enter a new category name.');
      return;
    }

    if (!finalCategory) {
      setMediaMessage('Please choose a category.');
      return;
    }

    if (mediaType === 'video' && !VIDEO_CATEGORIES.includes(finalCategory)) {
      setMediaMessage('Video category must be interview, hot_take, or cinematic.');
      return;
    }

    if (mediaType === 'video' && !cleanSlug) {
      setMediaMessage('Video slug is required.');
      return;
    }

    setSavingMedia(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('You must be logged in to upload media.');
      }

      if (cleanSlug) {
        const { data: existingSlug, error: slugError } = await supabase
          .from('media_items')
          .select('id')
          .eq('slug', cleanSlug)
          .limit(1);

        if (slugError) throw slugError;

        if (existingSlug && existingSlug.length > 0) {
          throw new Error('That slug already exists. Please use a different slug.');
        }
      }

      const fileExt = mediaFile.name.split('.').pop();
      const safeFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const folder = mediaType === 'video' ? 'admin-videos' : 'admin-uploads';
      const storagePath = `${folder}/${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, mediaFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const payload = {
        owner_id: user.id,
        title: cleanTitle || null,
        slug: cleanSlug || null,
        description: cleanDescription || null,
        tagline: cleanTagline || null,
        quote: cleanQuote || null,
        file_path: storagePath,
        watermarked_path: null,
        category: finalCategory || null,
        subcategory: cleanSubcategory || null,
        status: mediaStatus,
        hidden: mediaHidden,
        access_level: mediaAccessLevel,
        type: mediaType,
      };

      const { error: insertError } = await supabase.from('media_items').insert([payload]);

      if (insertError) {
        await supabase.storage.from('media').remove([storagePath]);
        throw insertError;
      }

      setMediaType('image');
      setMediaFile(null);
      setMediaTitle('');
      setMediaSlug('');
      setMediaDescription('');
      setMediaTagline('');
      setMediaQuote('');
      setMediaCategory('');
      setMediaSubcategory('');
      setMediaCategoryMode('existing');
      setNewMediaCategory('');
      setMediaAccessLevel('public');
      setMediaStatus('published');
      setMediaHidden(false);

      setMediaMessage(
        mediaType === 'video'
          ? 'Video uploaded successfully.'
          : 'Image uploaded successfully.'
      );

      const fileInput = document.getElementById('admin-media-file-input');
      if (fileInput) fileInput.value = '';

      await fetchMediaItems();
    } catch (error) {
      console.error('Media upload failed:', error);
      setMediaMessage(error.message || 'Media upload failed.');
    } finally {
      setSavingMedia(false);
    }
  }

  async function handleDeleteMedia(item) {
    const confirmed = window.confirm(
      `Delete this media item forever?\n\n${item.title || item.file_path || 'Untitled media'}`
    );
    if (!confirmed) return;

    try {
      if (item.file_path) {
        const { error: storageError } = await supabase.storage
          .from('media')
          .remove([item.file_path]);

        if (storageError) {
          console.error('Error deleting original media file:', storageError);
        }
      }

      if (item.watermarked_path) {
        const { error: watermarkError } = await supabase.storage
          .from('media')
          .remove([item.watermarked_path]);

        if (watermarkError) {
          console.error('Error deleting watermarked media file:', watermarkError);
        }
      }

      const { error: dbError } = await supabase
        .from('media_items')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;

      setMediaItems((current) => current.filter((media) => media.id !== item.id));
      alert('Media deleted successfully.');
    } catch (error) {
      console.error('Error deleting media item:', error);
      alert(error.message || 'Failed to delete media.');
    }
  }

  const promptCounts = useMemo(() => {
    const published = prompts.filter((item) => item.status === 'published').length;
    const draft = prompts.filter((item) => item.status !== 'published').length;

    return {
      total: prompts.length,
      published,
      draft,
    };
  }, [prompts]);

  const mediaCounts = useMemo(() => {
    const published = mediaItems.filter((item) => item.status === 'published').length;
    const hidden = mediaItems.filter((item) => item.hidden).length;
    const videos = mediaItems.filter((item) => item.type === 'video').length;

    return {
      total: mediaItems.length,
      published,
      hidden,
      videos,
    };
  }, [mediaItems]);

  const mediaCategoryOptions = mediaType === 'video' ? VIDEO_CATEGORIES : IMAGE_CATEGORIES;
  const mediaAcceptValue = mediaType === 'video' ? 'video/*' : 'image/*';

  if (checkingAccess) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
          <p style={styles.mutedText}>Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
          <p style={styles.errorText}>You do not have access to this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <h1 style={styles.pageTitle}>Admin Dashboard</h1>
        <p style={styles.mutedText}>
          Upload gallery images, load videos, and manage Supreme Access prompts from one place.
        </p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Recent Media Loaded</div>
          <div style={styles.statValue}>{mediaCounts.total}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Published Media</div>
          <div style={styles.statValue}>{mediaCounts.published}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Hidden Media</div>
          <div style={styles.statValue}>{mediaCounts.hidden}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Video Items</div>
          <div style={styles.statValue}>{mediaCounts.videos}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Prompts</div>
          <div style={styles.statValue}>{promptCounts.total}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Published Prompts</div>
          <div style={styles.statValue}>{promptCounts.published}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Draft Prompts</div>
          <div style={styles.statValue}>{promptCounts.draft}</div>
        </div>
      </div>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Upload Media</h2>

        <form onSubmit={handleMediaSubmit} style={styles.form}>
          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => {
                  const nextType = e.target.value;
                  setMediaType(nextType);
                  setMediaCategory('');
                  setNewMediaCategory('');
                  setMediaCategoryMode('existing');
                  setMediaFile(null);
                  const fileInput = document.getElementById('admin-media-file-input');
                  if (fileInput) fileInput.value = '';
                }}
                style={styles.select}
              >
                <option value="image">image</option>
                <option value="video">video</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>{mediaType === 'video' ? 'Video File' : 'Image File'}</label>
              <input
                id="admin-media-file-input"
                type="file"
                accept={mediaAcceptValue}
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                style={styles.fileInput}
                required
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              placeholder={mediaType === 'video' ? 'Enter video title' : 'Enter image title'}
              style={styles.input}
            />
          </div>

          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Slug</label>
              <input
                type="text"
                value={mediaSlug}
                onChange={(e) => setMediaSlug(slugify(e.target.value))}
                placeholder="example-video-title"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Category</label>
              <select
                value={mediaCategoryMode === 'new' ? '__new__' : mediaCategory}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === '__new__') {
                    setMediaCategoryMode('new');
                    setMediaCategory('');
                  } else {
                    setMediaCategoryMode('existing');
                    setMediaCategory(value);
                    setNewMediaCategory('');
                  }
                }}
                style={styles.select}
              >
                <option value="">Select category</option>
                {mediaCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                {mediaType !== 'video' ? <option value="__new__">+ Create New Category</option> : null}
              </select>

              {mediaCategoryMode === 'new' && mediaType !== 'video' ? (
                <input
                  type="text"
                  value={newMediaCategory}
                  onChange={(e) => setNewMediaCategory(e.target.value)}
                  placeholder="Enter new category name"
                  style={styles.input}
                />
              ) : null}
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={mediaDescription}
              onChange={(e) => setMediaDescription(e.target.value)}
              placeholder={
                mediaType === 'video'
                  ? 'Enter video description'
                  : 'Enter image description'
              }
              rows={4}
              style={styles.textarea}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Tagline</label>
            <input
              type="text"
              value={mediaTagline}
              onChange={(e) => setMediaTagline(e.target.value)}
              placeholder="Enter short tagline"
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Quote</label>
            <textarea
              value={mediaQuote}
              onChange={(e) => setMediaQuote(e.target.value)}
              placeholder="Enter quote"
              rows={4}
              style={styles.textarea}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Subcategory</label>
            <input
              type="text"
              value={mediaSubcategory}
              onChange={(e) => setMediaSubcategory(e.target.value)}
              placeholder="Example: Little Red Riding Hood"
              style={styles.input}
            />
          </div>

          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Access Level</label>
              <select
                value={mediaAccessLevel}
                onChange={(e) => setMediaAccessLevel(e.target.value)}
                style={styles.select}
              >
                <option value="public">public</option>
                <option value="supreme">supreme</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Status</label>
              <select
                value={mediaStatus}
                onChange={(e) => setMediaStatus(e.target.value)}
                style={styles.select}
              >
                <option value="published">published</option>
                <option value="pending">pending</option>
                <option value="draft">draft</option>
              </select>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Hidden</label>
            <select
              value={mediaHidden ? 'true' : 'false'}
              onChange={(e) => setMediaHidden(e.target.value === 'true')}
              style={styles.select}
            >
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </div>

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.primaryButton} disabled={savingMedia}>
              {savingMedia
                ? 'Uploading...'
                : mediaType === 'video'
                ? 'Upload Video'
                : 'Upload Image'}
            </button>
          </div>

          {mediaMessage ? (
            <p
              style={
                mediaMessage.toLowerCase().includes('failed') ||
                mediaMessage.toLowerCase().includes('required') ||
                mediaMessage.toLowerCase().includes('exists') ||
                mediaMessage.toLowerCase().includes('must')
                  ? styles.errorText
                  : styles.successText
              }
            >
              {mediaMessage}
            </p>
          ) : null}
        </form>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Recent Media</h2>

        {loadingMedia ? (
          <p style={styles.mutedText}>Loading media...</p>
        ) : mediaItems.length === 0 ? (
          <p style={styles.mutedText}>No media found yet.</p>
        ) : (
          <div style={styles.mediaGrid}>
            {mediaItems.map((item) => (
              <div key={item.id} style={styles.mediaCard}>
                {item.preview_url ? (
                  item.type === 'video' ? (
                    <video
                      src={item.preview_url}
                      style={styles.mediaPreview}
                      muted
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.preview_url}
                      alt={item.title || item.category || 'Media item'}
                      style={styles.mediaPreview}
                    />
                  )
                ) : (
                  <div style={styles.mediaPlaceholder}>No Preview</div>
                )}

                <div style={styles.metaRow}>
                  <span style={styles.metaBadge}>{item.type || 'unknown'}</span>
                  <span style={styles.metaBadge}>{item.category || 'Uncategorized'}</span>
                  {item.subcategory ? (
                    <span style={styles.metaBadge}>{item.subcategory}</span>
                  ) : null}
                  <span style={styles.metaBadge}>{item.access_level || '—'}</span>
                  <span style={styles.metaBadge}>{item.status || '—'}</span>
                  {item.hidden ? <span style={styles.metaBadge}>Hidden</span> : null}
                </div>

                <div style={styles.mediaInfoBlock}>
                  {item.title ? <h3 style={styles.mediaTitle}>{item.title}</h3> : null}
                  {item.slug ? <p style={styles.mediaSlug}>/{item.slug}</p> : null}
                  {item.description ? <p style={styles.mediaDescription}>{item.description}</p> : null}
                  {item.tagline ? <p style={styles.mediaTagline}>{item.tagline}</p> : null}
                  {item.quote ? <p style={styles.mediaQuote}>“{item.quote}”</p> : null}
                </div>

                <div style={styles.metaTextBlock}>
                  <div>
                    <strong>Owner:</strong> {item.owner_id || '—'}
                  </div>
                  <div>
                    <strong>Path:</strong> {item.file_path || '—'}
                  </div>
                  <div>
                    <strong>Created:</strong>{' '}
                    {item.created_at ? new Date(item.created_at).toLocaleString() : '—'}
                  </div>
                </div>

                <div style={styles.actionRow}>
                  <button
                    type="button"
                    style={styles.dangerButton}
                    onClick={() => handleDeleteMedia(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Upload Prompt</h2>

        <form onSubmit={handlePromptSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={promptTitle}
              onChange={(e) => setPromptTitle(e.target.value)}
              placeholder="Enter prompt title"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Prompt Text</label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Paste the full prompt text here"
              rows={8}
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Category</label>
              <input
                type="text"
                value={promptCategory}
                onChange={(e) => setPromptCategory(e.target.value)}
                placeholder="Example: Beauty, Editorial, Fantasy"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Status</label>
              <select
                value={promptStatus}
                onChange={(e) => setPromptStatus(e.target.value)}
                style={styles.select}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Prompt Preview Image</label>
            <input
              id="admin-prompt-file-input"
              type="file"
              accept="image/*"
              onChange={(e) => setPromptImageFile(e.target.files?.[0] || null)}
              style={styles.fileInput}
            />
          </div>

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.primaryButton} disabled={savingPrompt}>
              {savingPrompt ? 'Uploading...' : 'Upload Prompt'}
            </button>
          </div>

          {promptMessage ? (
            <p
              style={
                promptMessage.toLowerCase().includes('failed')
                  ? styles.errorText
                  : styles.successText
              }
            >
              {promptMessage}
            </p>
          ) : null}
        </form>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Existing Prompts</h2>

        {loadingPrompts ? (
          <p style={styles.mutedText}>Loading prompts...</p>
        ) : prompts.length === 0 ? (
          <p style={styles.mutedText}>No prompts found yet.</p>
        ) : (
          <div style={styles.promptList}>
            {prompts.map((prompt) => {
              const isPublished = prompt.status === 'published';

              return (
                <div key={prompt.id} style={styles.promptCard}>
                  <div style={styles.promptTopRow}>
                    <div>
                      <h3 style={styles.promptTitle}>{prompt.title}</h3>
                      <div style={styles.metaRow}>
                        <span style={styles.metaBadge}>
                          {prompt.category || 'Uncategorized'}
                        </span>
                        <span
                          style={{
                            ...styles.metaBadge,
                            ...(isPublished ? styles.publishedBadge : styles.draftBadge),
                          }}
                        >
                          {isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {prompt.preview_url ? (
                    <div style={styles.previewWrap}>
                      <img
                        src={prompt.preview_url}
                        alt={prompt.title}
                        style={styles.previewImage}
                      />
                    </div>
                  ) : null}

                  <p style={styles.promptText}>{prompt.prompt_text}</p>

                  <div style={styles.metaTextBlock}>
                    <div>
                      <strong>Created:</strong>{' '}
                      {prompt.created_at ? new Date(prompt.created_at).toLocaleString() : '—'}
                    </div>
                    <div>
                      <strong>Published:</strong>{' '}
                      {prompt.published_at ? new Date(prompt.published_at).toLocaleString() : '—'}
                    </div>
                    <div>
                      <strong>Image Path:</strong> {prompt.image_url || '—'}
                    </div>
                  </div>

                  <div style={styles.actionRow}>
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() => handlePromptStatusChange(prompt.id, 'draft')}
                    >
                      Set Draft
                    </button>

                    <button
                      type="button"
                      style={styles.primaryButton}
                      onClick={() => handlePromptStatusChange(prompt.id, 'published')}
                    >
                      Publish
                    </button>

                    <button
                      type="button"
                      style={styles.dangerButton}
                      onClick={() => handleDeletePrompt(prompt.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
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
    background: '#0b0b0f',
    color: '#f5f5f5',
  },
  headerCard: {
    background: '#15151c',
    border: '1px solid #2a2a35',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  },
  pageTitle: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 700,
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '24px',
    fontWeight: 700,
  },
  card: {
    background: '#15151c',
    border: '1px solid #2a2a35',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: '#15151c',
    border: '1px solid #2a2a35',
    borderRadius: '16px',
    padding: '20px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#b8b8c7',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
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
    fontWeight: 600,
    color: '#d7d7e0',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #343444',
    background: '#0f0f15',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #343444',
    background: '#0f0f15',
    color: '#ffffff',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #343444',
    background: '#0f0f15',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  fileInput: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #343444',
    background: '#0f0f15',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    background: '#ffffff',
    color: '#111111',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #3a3a49',
    background: '#1d1d27',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  dangerButton: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #5f2830',
    background: '#31161b',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  promptList: {
    display: 'grid',
    gap: '16px',
  },
  promptCard: {
    border: '1px solid #2f2f3d',
    borderRadius: '16px',
    background: '#101018',
    padding: '18px',
  },
  promptTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  promptTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
  },
  metaRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '10px',
    marginBottom: '10px',
  },
  metaBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    background: '#232331',
    color: '#f1f1f5',
  },
  publishedBadge: {
    background: '#1f3b28',
  },
  draftBadge: {
    background: '#3a2f19',
  },
  previewWrap: {
    marginBottom: '14px',
  },
  previewImage: {
    width: '100%',
    maxWidth: '320px',
    display: 'block',
    borderRadius: '14px',
    border: '1px solid #2c2c39',
  },
  promptText: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    color: '#ececf2',
    marginBottom: '14px',
  },
  metaTextBlock: {
    display: 'grid',
    gap: '6px',
    color: '#bcbccc',
    fontSize: '13px',
    marginBottom: '16px',
    wordBreak: 'break-word',
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  mediaCard: {
    border: '1px solid #2f2f3d',
    borderRadius: '16px',
    background: '#101018',
    padding: '16px',
  },
  mediaPreview: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    borderRadius: '14px',
    border: '1px solid #2c2c39',
    marginBottom: '12px',
    background: '#0f0f15',
  },
  mediaPlaceholder: {
    width: '100%',
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '14px',
    border: '1px solid #2c2c39',
    background: '#14141d',
    color: '#9b9bac',
    marginBottom: '12px',
  },
  mediaInfoBlock: {
    marginBottom: '12px',
  },
  mediaTitle: {
    margin: '0 0 6px 0',
    fontSize: '18px',
    fontWeight: 700,
    color: '#f5f5f5',
  },
  mediaSlug: {
    margin: '0 0 8px 0',
    color: '#8e8ea3',
    fontSize: '13px',
    wordBreak: 'break-word',
  },
  mediaDescription: {
    margin: '0 0 8px 0',
    color: '#d8d8e3',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  mediaTagline: {
    margin: '0 0 8px 0',
    color: '#d8d8e3',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  mediaQuote: {
    margin: 0,
    color: '#b8b8c7',
    fontSize: '14px',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  mutedText: {
    color: '#b8b8c7',
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
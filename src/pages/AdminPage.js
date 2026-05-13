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

function makeAutoTitle(type, index = 0) {
  const label = type === 'video' ? 'Untitled Video' : 'Untitled Image';
  const number = String(index + 1).padStart(2, '0');
  return `${label} ${number} ${Date.now()}`;
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

  const [editingMediaId, setEditingMediaId] = useState(null);
  const [savingMediaEdit, setSavingMediaEdit] = useState(false);
  const [editMediaTitle, setEditMediaTitle] = useState('');
  const [editMediaSlug, setEditMediaSlug] = useState('');
  const [editMediaDescription, setEditMediaDescription] = useState('');
  const [editMediaTagline, setEditMediaTagline] = useState('');
  const [editMediaQuote, setEditMediaQuote] = useState('');
  const [editMediaCategory, setEditMediaCategory] = useState('');
  const [editMediaSubcategory, setEditMediaSubcategory] = useState('');
  const [editMediaAccessLevel, setEditMediaAccessLevel] = useState('public');
  const [editMediaStatus, setEditMediaStatus] = useState('published');
  const [editMediaHidden, setEditMediaHidden] = useState(false);

  const [loadingVault, setLoadingVault] = useState(true);
  const [savingVault, setSavingVault] = useState(false);
  const [vaultMessage, setVaultMessage] = useState('');
  const [vaultItems, setVaultItems] = useState([]);
  const [vaultTitle, setVaultTitle] = useState('');
  const [vaultExcerpt, setVaultExcerpt] = useState('');
  const [vaultContent, setVaultContent] = useState('');
  const [vaultCategory, setVaultCategory] = useState('');
  const [vaultStatus, setVaultStatus] = useState('draft');

  const [mediaType, setMediaType] = useState('image');
  const [mediaFiles, setMediaFiles] = useState([]);
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
      fetchVaultItems();
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

      if (userError || !user) {
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

      const withPreviewUrls = await Promise.all(
        (data || []).map(async (item) => {
          if (!item.image_url) return { ...item, preview_url: '' };

          const { data: signed, error: signedError } = await supabase.storage
            .from('media')
            .createSignedUrl(item.image_url, 60 * 60);

          if (signedError) {
            console.error('Prompt signed URL error:', signedError);
            return { ...item, preview_url: '' };
          }

          return { ...item, preview_url: signed?.signedUrl || '' };
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
          'id, owner_id, title, slug, description, tagline, quote, file_path, watermarked_path, category, subcategory, status, hidden, access_level, type, featured, homepage_featured, created_at'
        )
        .order('created_at', { ascending: false })
        .limit(48);

      if (error) throw error;

      const withUrls = await Promise.all(
        (data || []).map(async (item) => {
          if (!item.file_path) return { ...item, preview_url: '' };

          const { data: signed, error: signedError } = await supabase.storage
            .from('media')
            .createSignedUrl(item.file_path, 60 * 60);

          if (signedError) {
            console.error('Signed URL error:', signedError);
            return { ...item, preview_url: '' };
          }

          return { ...item, preview_url: signed?.signedUrl || '' };
        })
      );

      setMediaItems(withUrls);
    } catch (error) {
      console.error('Error fetching media items:', error);
    } finally {
      setLoadingMedia(false);
    }
  }

  async function fetchVaultItems() {
    setLoadingVault(true);

    try {
      const { data, error } = await supabase
        .from('expression_vault')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVaultItems(data || []);
    } catch (error) {
      console.error('Error fetching vault items:', error);
    } finally {
      setLoadingVault(false);
    }
  }

  async function handleMediaSubmit(event) {
    event.preventDefault();
    setMediaMessage('');

    if (!mediaFiles.length) {
      setMediaMessage(`Please choose ${mediaType === 'video' ? 'a video file' : 'one or more image files'}.`);
      return;
    }

    const cleanTitle = mediaTitle.trim();
    const cleanDescription = mediaDescription.trim();
    const cleanTagline = mediaTagline.trim();
    const cleanQuote = mediaQuote.trim();
    const cleanSubcategory = mediaSubcategory.trim();
    const selectedCategory =
      mediaCategoryMode === 'new' ? newMediaCategory.trim() : mediaCategory.trim();

    const autoCategory =
      selectedCategory || (mediaType === 'video' ? 'cinematic' : 'editorial');

    if (mediaType === 'video' && !VIDEO_CATEGORIES.includes(autoCategory)) {
      setMediaMessage('Video category must be interview, hot_take, or cinematic.');
      return;
    }

    setSavingMedia(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error('You must be logged in to upload media.');

      let uploadedCount = 0;

      for (let index = 0; index < mediaFiles.length; index += 1) {
        const file = mediaFiles[index];
        const baseTitle =
          cleanTitle && mediaFiles.length > 1
            ? `${cleanTitle} ${String(index + 1).padStart(2, '0')}`
            : cleanTitle || makeAutoTitle(mediaType, index);

        const baseSlug =
          mediaFiles.length > 1
            ? slugify(`${mediaSlug || baseTitle}-${index + 1}-${Date.now()}`)
            : slugify(mediaSlug || baseTitle);

        const { data: existingSlug, error: slugError } = await supabase
          .from('media_items')
          .select('id')
          .eq('slug', baseSlug)
          .limit(1);

        if (slugError) throw slugError;

        if (existingSlug && existingSlug.length > 0) {
          throw new Error(`Slug already exists for ${baseTitle}. Please use a different slug.`);
        }

        const fileExt = file.name.split('.').pop();
        const safeFileName = `${Date.now()}-${index}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;
        const folder = mediaType === 'video' ? 'admin-videos' : 'admin-uploads';
        const storagePath = `${folder}/${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const payload = {
          owner_id: user.id,
          title: baseTitle,
          slug: baseSlug,
          description: cleanDescription || '',
          tagline: cleanTagline || '',
          quote: cleanQuote || '',
          file_path: storagePath,
          watermarked_path: null,
          category: autoCategory,
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

        uploadedCount += 1;
      }

      setMediaType('image');
      setMediaFiles([]);
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
        `${uploadedCount} ${uploadedCount === 1 ? 'item' : 'items'} uploaded successfully. You can edit each title, quote, and details later.`
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

  function startEditingMedia(item) {
    setEditingMediaId(item.id);
    setEditMediaTitle(item.title || '');
    setEditMediaSlug(item.slug || '');
    setEditMediaDescription(item.description || '');
    setEditMediaTagline(item.tagline || '');
    setEditMediaQuote(item.quote || '');
    setEditMediaCategory(item.category || '');
    setEditMediaSubcategory(item.subcategory || '');
    setEditMediaAccessLevel(item.access_level || 'public');
    setEditMediaStatus(item.status || 'published');
    setEditMediaHidden(Boolean(item.hidden));
  }

  function cancelEditingMedia() {
    setEditingMediaId(null);
    setEditMediaTitle('');
    setEditMediaSlug('');
    setEditMediaDescription('');
    setEditMediaTagline('');
    setEditMediaQuote('');
    setEditMediaCategory('');
    setEditMediaSubcategory('');
    setEditMediaAccessLevel('public');
    setEditMediaStatus('published');
    setEditMediaHidden(false);
  }

  async function saveMediaEdits(item) {
    const cleanTitle = editMediaTitle.trim() || item.title || makeAutoTitle(item.type || 'image');
    const cleanSlug = slugify(editMediaSlug || cleanTitle);
    const cleanCategory =
      editMediaCategory.trim() || (item.type === 'video' ? 'cinematic' : 'editorial');

    if (item.type === 'video' && !VIDEO_CATEGORIES.includes(cleanCategory)) {
      alert('Video category must be interview, hot_take, or cinematic.');
      return;
    }

    setSavingMediaEdit(true);

    try {
      const { data: existingSlug, error: slugError } = await supabase
        .from('media_items')
        .select('id')
        .eq('slug', cleanSlug)
        .neq('id', item.id)
        .limit(1);

      if (slugError) throw slugError;

      if (existingSlug && existingSlug.length > 0) {
        throw new Error('That slug already exists. Please use a different slug.');
      }

      const updates = {
        title: cleanTitle,
        slug: cleanSlug,
        description: editMediaDescription.trim(),
        tagline: editMediaTagline.trim(),
        quote: editMediaQuote.trim(),
        category: cleanCategory,
        subcategory: editMediaSubcategory.trim() || null,
        access_level: editMediaAccessLevel,
        status: editMediaStatus,
        hidden: editMediaHidden,
      };

      const { error } = await supabase
        .from('media_items')
        .update(updates)
        .eq('id', item.id);

      if (error) throw error;

      setMediaItems((current) =>
        current.map((media) =>
          media.id === item.id
            ? {
                ...media,
                ...updates,
              }
            : media
        )
      );

      cancelEditingMedia();
    } catch (error) {
      console.error('Media edit failed:', error);
      alert(error.message || 'Could not save media edits.');
    } finally {
      setSavingMediaEdit(false);
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

  async function handleVaultSubmit(event) {
    event.preventDefault();
    setVaultMessage('');

    const cleanTitle = vaultTitle.trim();
    const cleanExcerpt = vaultExcerpt.trim();
    const cleanContent = vaultContent.trim();
    const cleanCategory = vaultCategory.trim();
    const cleanStatus = vaultStatus === 'published' ? 'published' : 'draft';

    if (!cleanTitle || !cleanContent) {
      setVaultMessage('Title and full content are required.');
      return;
    }

    setSavingVault(true);

    try {
      const payload = {
        title: cleanTitle,
        excerpt: cleanExcerpt || null,
        content: cleanContent,
        category: cleanCategory || null,
        status: cleanStatus,
      };

      const { error } = await supabase.from('expression_vault').insert([payload]);

      if (error) throw error;

      setVaultTitle('');
      setVaultExcerpt('');
      setVaultContent('');
      setVaultCategory('');
      setVaultStatus('draft');
      setVaultMessage('Vault entry created successfully.');

      await fetchVaultItems();
    } catch (error) {
      console.error('Vault entry upload failed:', error);
      setVaultMessage(error.message || 'Vault entry upload failed.');
    } finally {
      setSavingVault(false);
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
        current.map((item) => (item.id === promptId ? { ...item, ...updates } : item))
      );
    } catch (error) {
      console.error('Prompt status update failed:', error);
      alert(error.message || 'Could not update prompt status.');
    }
  }

  async function handleVaultStatusChange(vaultId, nextStatus) {
    try {
      const updates = {
        status: nextStatus,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('expression_vault')
        .update(updates)
        .eq('id', vaultId);

      if (error) throw error;

      setVaultItems((current) =>
        current.map((item) => (item.id === vaultId ? { ...item, ...updates } : item))
      );
    } catch (error) {
      console.error('Vault status update failed:', error);
      alert(error.message || 'Could not update vault status.');
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

        if (storageError) console.error('Prompt preview image delete failed:', storageError);
      }

      setPrompts((current) => current.filter((item) => item.id !== promptId));
    } catch (error) {
      console.error('Prompt delete failed:', error);
      alert(error.message || 'Could not delete prompt.');
    }
  }

  async function handleDeleteVault(vaultId) {
    const confirmed = window.confirm('Delete this vault entry?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('expression_vault')
        .delete()
        .eq('id', vaultId);

      if (error) throw error;

      setVaultItems((current) => current.filter((item) => item.id !== vaultId));
    } catch (error) {
      console.error('Vault delete failed:', error);
      alert(error.message || 'Could not delete vault entry.');
    }
  }

  async function toggleFeatured(id, currentValue) {
    try {
      const { error } = await supabase
        .from('media_items')
        .update({ featured: !currentValue })
        .eq('id', id);

      if (error) throw error;

      await fetchMediaItems();
    } catch (error) {
      console.error('Error updating featured:', error);
      alert(error.message || 'Failed to update featured status.');
    }
  }

  async function toggleHomepageFeatured(id, currentValue) {
    try {
      if (!currentValue) {
        const { error: clearError } = await supabase
          .from('media_items')
          .update({ homepage_featured: false })
          .eq('homepage_featured', true);

        if (clearError) throw clearError;
      }

      const { error } = await supabase
        .from('media_items')
        .update({ homepage_featured: !currentValue })
        .eq('id', id);

      if (error) throw error;

      await fetchMediaItems();
    } catch (error) {
      console.error('Error updating homepage featured:', error);
      alert(error.message || 'Failed to update homepage screening.');
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

        if (storageError) console.error('Error deleting original media file:', storageError);
      }

      if (item.watermarked_path) {
        const { error: watermarkError } = await supabase.storage
          .from('media')
          .remove([item.watermarked_path]);

        if (watermarkError) console.error('Error deleting watermarked media file:', watermarkError);
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

    return { total: prompts.length, published, draft };
  }, [prompts]);

  const vaultCounts = useMemo(() => {
    const published = vaultItems.filter((item) => item.status === 'published').length;
    const draft = vaultItems.filter((item) => item.status !== 'published').length;

    return { total: vaultItems.length, published, draft };
  }, [vaultItems]);

  const mediaCounts = useMemo(() => {
    const published = mediaItems.filter((item) => item.status === 'published').length;
    const hidden = mediaItems.filter((item) => item.hidden).length;
    const videos = mediaItems.filter((item) => item.type === 'video').length;
    const featured = mediaItems.filter((item) => item.featured).length;
    const homepageFeatured = mediaItems.filter((item) => item.homepage_featured).length;

    return {
      total: mediaItems.length,
      published,
      hidden,
      videos,
      featured,
      homepageFeatured,
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
          Upload gallery images, load videos, manage Supreme Access prompts, and control Expression Vault content from one place.
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
          <div style={styles.statLabel}>Featured Items</div>
          <div style={styles.statValue}>{mediaCounts.featured}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Homepage Screening</div>
          <div style={styles.statValue}>{mediaCounts.homepageFeatured}</div>
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
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Vault Entries</div>
          <div style={styles.statValue}>{vaultCounts.total}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Published Vault</div>
          <div style={styles.statValue}>{vaultCounts.published}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Draft Vault</div>
          <div style={styles.statValue}>{vaultCounts.draft}</div>
        </div>
      </div>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Upload Media</h2>
        <p style={styles.mutedText}>
          Batch image upload is active. Select multiple images at once, upload them as separate media cards, then edit each title and quote later.
        </p>

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
                  setMediaFiles([]);
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
              <label style={styles.label}>
                {mediaType === 'video' ? 'Video File' : 'Image Files'}
              </label>
              <input
                id="admin-media-file-input"
                type="file"
                accept={mediaAcceptValue}
                multiple={mediaType === 'image'}
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files || []);
                  setMediaFiles(mediaType === 'video' ? selectedFiles.slice(0, 1) : selectedFiles);
                }}
                style={styles.fileInput}
                required
              />
              <p style={styles.smallMutedText}>
                {mediaFiles.length
                  ? `${mediaFiles.length} ${mediaFiles.length === 1 ? 'file selected' : 'files selected'}`
                  : mediaType === 'image'
                  ? 'You can select more than one image.'
                  : 'Videos stay single upload for stability.'}
              </p>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Shared Title Optional</label>
            <input
              type="text"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              placeholder="Optional. For batch uploads, each image gets a numbered title."
              style={styles.input}
            />
          </div>

          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Shared Slug Optional</label>
              <input
                type="text"
                value={mediaSlug}
                onChange={(e) => setMediaSlug(slugify(e.target.value))}
                placeholder="optional-custom-slug"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Category Optional</label>
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
                <option value="">Auto category</option>
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
            <label style={styles.label}>Shared Description Optional</label>
            <textarea
              value={mediaDescription}
              onChange={(e) => setMediaDescription(e.target.value)}
              placeholder="Optional. You can edit each image later."
              rows={4}
              style={styles.textarea}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Shared Tagline Optional</label>
            <input
              type="text"
              value={mediaTagline}
              onChange={(e) => setMediaTagline(e.target.value)}
              placeholder="Optional short tagline"
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Shared Quote Optional</label>
            <textarea
              value={mediaQuote}
              onChange={(e) => setMediaQuote(e.target.value)}
              placeholder="Optional shared quote. Each item can be changed later."
              rows={4}
              style={styles.textarea}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Shared Subcategory Optional</label>
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
                ? 'Fast Upload Video'
                : 'Batch Upload Images'}
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
            {mediaItems.map((item) => {
              const isEditing = editingMediaId === item.id;
              const editCategoryOptions = item.type === 'video' ? VIDEO_CATEGORIES : IMAGE_CATEGORIES;

              return (
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

                  {isEditing ? (
                    <div style={styles.editPanel}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Title</label>
                        <input
                          type="text"
                          value={editMediaTitle}
                          onChange={(e) => {
                            setEditMediaTitle(e.target.value);
                            setEditMediaSlug(slugify(e.target.value));
                          }}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Slug</label>
                        <input
                          type="text"
                          value={editMediaSlug}
                          onChange={(e) => setEditMediaSlug(slugify(e.target.value))}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                          value={editMediaDescription}
                          onChange={(e) => setEditMediaDescription(e.target.value)}
                          rows={4}
                          style={styles.textarea}
                        />
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Tagline</label>
                        <input
                          type="text"
                          value={editMediaTagline}
                          onChange={(e) => setEditMediaTagline(e.target.value)}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Quote</label>
                        <textarea
                          value={editMediaQuote}
                          onChange={(e) => setEditMediaQuote(e.target.value)}
                          rows={4}
                          style={styles.textarea}
                        />
                      </div>

                      <div style={styles.twoColumnGrid}>
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Category</label>
                          <select
                            value={editMediaCategory}
                            onChange={(e) => setEditMediaCategory(e.target.value)}
                            style={styles.select}
                          >
                            <option value="">Auto category</option>
                            {editCategoryOptions.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Subcategory</label>
                          <input
                            type="text"
                            value={editMediaSubcategory}
                            onChange={(e) => setEditMediaSubcategory(e.target.value)}
                            style={styles.input}
                          />
                        </div>
                      </div>

                      <div style={styles.twoColumnGrid}>
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Access Level</label>
                          <select
                            value={editMediaAccessLevel}
                            onChange={(e) => setEditMediaAccessLevel(e.target.value)}
                            style={styles.select}
                          >
                            <option value="public">public</option>
                            <option value="supreme">supreme</option>
                          </select>
                        </div>

                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Status</label>
                          <select
                            value={editMediaStatus}
                            onChange={(e) => setEditMediaStatus(e.target.value)}
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
                          value={editMediaHidden ? 'true' : 'false'}
                          onChange={(e) => setEditMediaHidden(e.target.value === 'true')}
                          style={styles.select}
                        >
                          <option value="false">false</option>
                          <option value="true">true</option>
                        </select>
                      </div>

                      <div style={styles.actionRow}>
                        <button
                          type="button"
                          style={styles.primaryButton}
                          disabled={savingMediaEdit}
                          onClick={() => saveMediaEdits(item)}
                        >
                          {savingMediaEdit ? 'Saving...' : 'Save Edits'}
                        </button>
                        <button
                          type="button"
                          style={styles.secondaryButton}
                          onClick={cancelEditingMedia}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={styles.metaRow}>
                        <span style={styles.metaBadge}>{item.type || 'unknown'}</span>
                        <span style={styles.metaBadge}>{item.category || 'Uncategorized'}</span>
                        {item.subcategory ? <span style={styles.metaBadge}>{item.subcategory}</span> : null}
                        <span style={styles.metaBadge}>{item.access_level || '—'}</span>
                        <span style={styles.metaBadge}>{item.status || '—'}</span>
                        {item.hidden ? <span style={styles.metaBadge}>Hidden</span> : null}
                        {item.featured ? <span style={styles.featuredBadge}>Featured</span> : null}
                        {item.homepage_featured ? (
                          <span style={styles.homepageBadge}>Homepage Screening</span>
                        ) : null}
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
                          style={styles.secondaryButton}
                          onClick={() => startEditingMedia(item)}
                        >
                          Edit Details
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleFeatured(item.id, item.featured)}
                          style={item.featured ? styles.featuredOnButton : styles.featuredOffButton}
                        >
                          {item.featured ? '⭐ Featured' : '☆ Feature'}
                        </button>

                        {item.type === 'video' ? (
                          <button
                            type="button"
                            onClick={() => toggleHomepageFeatured(item.id, item.homepage_featured)}
                            style={
                              item.homepage_featured
                                ? styles.homepageOnButton
                                : styles.homepageOffButton
                            }
                          >
                            {item.homepage_featured
                              ? '🎬 Homepage Screening'
                              : 'Set Homepage Screening'}
                          </button>
                        ) : null}

                        <button
                          type="button"
                          style={styles.dangerButton}
                          onClick={() => handleDeleteMedia(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Expression Vault</h2>

        <form onSubmit={handleVaultSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={vaultTitle}
              onChange={(e) => setVaultTitle(e.target.value)}
              placeholder="Enter vault entry title"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Excerpt</label>
            <textarea
              value={vaultExcerpt}
              onChange={(e) => setVaultExcerpt(e.target.value)}
              placeholder="Enter a short excerpt for the vault card"
              rows={4}
              style={styles.textarea}
            />
          </div>

          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Category</label>
              <input
                type="text"
                value={vaultCategory}
                onChange={(e) => setVaultCategory(e.target.value)}
                placeholder="Example: Power, Devotion, Silence"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Status</label>
              <select
                value={vaultStatus}
                onChange={(e) => setVaultStatus(e.target.value)}
                style={styles.select}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Content</label>
            <textarea
              value={vaultContent}
              onChange={(e) => setVaultContent(e.target.value)}
              placeholder="Paste the full poem, monologue, or expression here"
              rows={14}
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.primaryButton} disabled={savingVault}>
              {savingVault ? 'Saving...' : 'Add Vault Entry'}
            </button>
          </div>

          {vaultMessage ? (
            <p
              style={
                vaultMessage.toLowerCase().includes('failed') ||
                vaultMessage.toLowerCase().includes('required')
                  ? styles.errorText
                  : styles.successText
              }
            >
              {vaultMessage}
            </p>
          ) : null}
        </form>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Existing Vault Entries</h2>

        {loadingVault ? (
          <p style={styles.mutedText}>Loading vault entries...</p>
        ) : vaultItems.length === 0 ? (
          <p style={styles.mutedText}>No vault entries found yet.</p>
        ) : (
          <div style={styles.promptList}>
            {vaultItems.map((item) => {
              const isPublished = item.status === 'published';

              return (
                <div key={item.id} style={styles.promptCard}>
                  <div style={styles.promptTopRow}>
                    <div>
                      <h3 style={styles.promptTitle}>{item.title}</h3>
                      <div style={styles.metaRow}>
                        <span style={styles.metaBadge}>{item.category || 'Uncategorized'}</span>
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

                  {item.excerpt ? <p style={styles.mediaDescription}>{item.excerpt}</p> : null}

                  <p style={styles.promptText}>{item.content}</p>

                  <div style={styles.metaTextBlock}>
                    <div>
                      <strong>Created:</strong>{' '}
                      {item.created_at ? new Date(item.created_at).toLocaleString() : '—'}
                    </div>
                    <div>
                      <strong>Updated:</strong>{' '}
                      {item.updated_at ? new Date(item.updated_at).toLocaleString() : '—'}
                    </div>
                  </div>

                  <div style={styles.actionRow}>
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() => handleVaultStatusChange(item.id, 'draft')}
                    >
                      Set Draft
                    </button>

                    <button
                      type="button"
                      style={styles.primaryButton}
                      onClick={() => handleVaultStatusChange(item.id, 'published')}
                    >
                      Publish
                    </button>

                    <button
                      type="button"
                      style={styles.dangerButton}
                      onClick={() => handleDeleteVault(item.id)}
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
                        <span style={styles.metaBadge}>{prompt.category || 'Uncategorized'}</span>
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
                      <img src={prompt.preview_url} alt={prompt.title} style={styles.previewImage} />
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
    whiteSpace: 'pre-wrap',
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
  featuredOnButton: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #d4af37',
    background: '#d4af37',
    color: '#111111',
    fontWeight: 700,
    cursor: 'pointer',
  },
  featuredOffButton: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #3a3a49',
    background: '#1d1d27',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  homepageOnButton: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #f1d08a',
    background: 'linear-gradient(135deg, #c58d36, #f1d08a)',
    color: '#111111',
    fontWeight: 800,
    cursor: 'pointer',
  },
  homepageOffButton: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #5a4a2c',
    background: '#211b12',
    color: '#f5f5f5',
    fontWeight: 800,
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
  featuredBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    background: '#d4af37',
    color: '#111111',
  },
  homepageBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #c58d36, #f1d08a)',
    color: '#111111',
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
    whiteSpace: 'pre-wrap',
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
  editPanel: {
    display: 'grid',
    gap: '14px',
    marginTop: '12px',
    paddingTop: '14px',
    borderTop: '1px solid #2f2f3d',
  },
  mutedText: {
    color: '#b8b8c7',
  },
  smallMutedText: {
    color: '#8e8ea3',
    fontSize: '13px',
    margin: 0,
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
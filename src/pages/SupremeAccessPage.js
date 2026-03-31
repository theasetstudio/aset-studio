import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SupremeAccessPage() {
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedPromptIds, setExpandedPromptIds] = useState([]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  async function fetchPrompts() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('prompt_library')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const items = data || [];

      const withSignedUrls = await Promise.all(
        items.map(async (item) => {
          if (!item.image_url) {
            return {
              ...item,
              image_src: '',
            };
          }

          const { data: signed, error: signedError } = await supabase.storage
            .from('media')
            .createSignedUrl(item.image_url, 60 * 60);

          if (signedError) {
            console.error('Prompt image signed URL error:', signedError);
            return {
              ...item,
              image_src: '',
            };
          }

          return {
            ...item,
            image_src: signed?.signedUrl || '',
          };
        })
      );

      setPrompts(withSignedUrls);
    } catch (error) {
      console.error('Error fetching prompt library:', error);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleExpanded(promptId) {
    setExpandedPromptIds((current) =>
      current.includes(promptId)
        ? current.filter((id) => id !== promptId)
        : [...current, promptId]
    );
  }

  async function handleCopy(promptText) {
    try {
      await navigator.clipboard.writeText(promptText || '');
      alert('Prompt copied.');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Could not copy prompt.');
    }
  }

  function handleDownload(prompt) {
    try {
      const fileNameBase = (prompt.title || 'prompt')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const blob = new Blob([prompt.prompt_text || ''], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileNameBase || 'prompt'}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Could not download prompt.');
    }
  }

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        prompts
          .map((item) => item.category)
          .filter((value) => typeof value === 'string' && value.trim() !== '')
      )
    );

    return ['all', ...values];
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    if (selectedCategory === 'all') return prompts;

    return prompts.filter((item) => item.category === selectedCategory);
  }, [prompts, selectedCategory]);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Supreme Access</h1>
        <p style={styles.subtitle}>
          Published prompt vault with secure image previews from your private media bucket.
        </p>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.filterWrap}>
          <label htmlFor="prompt-category-filter" style={styles.filterLabel}>
            Category
          </label>
          <select
            id="prompt-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.select}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={styles.emptyStateCard}>
          <p style={styles.mutedText}>Loading prompts...</p>
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div style={styles.emptyStateCard}>
          <p style={styles.mutedText}>No published prompts found.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredPrompts.map((prompt) => {
            const isExpanded = expandedPromptIds.includes(prompt.id);

            return (
              <article key={prompt.id} style={styles.card}>
                <div style={styles.imageFrame}>
                  {prompt.image_src ? (
                    <img
                      src={prompt.image_src}
                      alt={prompt.title || 'Prompt preview'}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.imageFallback}>No Preview</div>
                  )}
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.titleRow}>
                    <h2 style={styles.cardTitle}>{prompt.title || 'Untitled Prompt'}</h2>
                    <span style={styles.statusBadge}>PUBLISHED</span>
                  </div>

                  <div style={styles.metaRow}>
                    <span style={styles.categoryText}>{prompt.category || 'Uncategorized'}</span>
                    <span style={styles.newBadge}>NEW</span>
                  </div>

                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={styles.actionButton}
                      onClick={() => toggleExpanded(prompt.id)}
                    >
                      {isExpanded ? 'Hide Prompt' : 'Show Prompt'}
                    </button>

                    <button
                      type="button"
                      style={styles.actionButton}
                      onClick={() => handleCopy(prompt.prompt_text)}
                    >
                      Copy
                    </button>

                    <button
                      type="button"
                      style={styles.actionButton}
                      onClick={() => handleDownload(prompt)}
                    >
                      Download
                    </button>

                    <button
                      type="button"
                      style={styles.actionButton}
                      onClick={() => alert('Favorite system can be wired next.')}
                    >
                      ★ Favorite
                    </button>
                  </div>

                  {isExpanded ? (
                    <div style={styles.promptBox}>
                      <pre style={styles.promptText}>{prompt.prompt_text || ''}</pre>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '32px',
    background:
      'radial-gradient(circle at top, rgba(32,32,40,0.55) 0%, rgba(8,8,10,1) 55%, rgba(3,3,5,1) 100%)',
    color: '#f5f5f7',
  },
  hero: {
    maxWidth: '1100px',
    margin: '0 auto 28px auto',
  },
  title: {
    margin: 0,
    fontSize: '40px',
    fontWeight: 800,
    letterSpacing: '0.02em',
  },
  subtitle: {
    marginTop: '10px',
    color: '#b6b6c4',
    fontSize: '15px',
    lineHeight: 1.6,
  },
  toolbar: {
    maxWidth: '1100px',
    margin: '0 auto 24px auto',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterWrap: {
    display: 'grid',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#d5d5de',
  },
  select: {
    minWidth: '220px',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #333645',
    background: '#101117',
    color: '#ffffff',
    fontSize: '14px',
  },
  emptyStateCard: {
    maxWidth: '1100px',
    margin: '0 auto',
    borderRadius: '22px',
    border: '1px solid #242735',
    background: 'rgba(10,10,14,0.82)',
    padding: '28px',
  },
  mutedText: {
    margin: 0,
    color: '#a6a6b6',
  },
  grid: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gap: '24px',
  },
  card: {
    borderRadius: '24px',
    border: '1px solid #242735',
    background: 'rgba(9,10,14,0.9)',
    boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
    overflow: 'hidden',
  },
  imageFrame: {
    width: '100%',
    minHeight: '360px',
    background: '#090a0f',
    borderBottom: '1px solid #1f2230',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '420px',
    objectFit: 'cover',
    display: 'block',
  },
  imageFallback: {
    width: '100%',
    height: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8e90a1',
    background: '#0d0f15',
    fontSize: '15px',
  },
  cardBody: {
    padding: '22px',
  },
  titleRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cardTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 800,
    textTransform: 'uppercase',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #274f32',
    background: 'rgba(20,46,27,0.45)',
    color: '#7ed88e',
    borderRadius: '999px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 700,
  },
  metaRow: {
    marginTop: '8px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryText: {
    color: '#e7e7ef',
    fontSize: '14px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  newBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '999px',
    padding: '5px 10px',
    fontSize: '11px',
    fontWeight: 700,
    background: '#4e473a',
    color: '#f6eed5',
    border: '1px solid #655c48',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '18px',
  },
  actionButton: {
    borderRadius: '14px',
    padding: '12px 16px',
    border: '1px solid #454959',
    background: 'linear-gradient(180deg, #1b1f29 0%, #11141b 100%)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  },
  promptBox: {
    marginTop: '18px',
    borderRadius: '18px',
    border: '1px solid #282c3b',
    background: '#0d1017',
    padding: '18px',
  },
  promptText: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: '#ececf2',
    fontFamily: 'inherit',
    lineHeight: 1.7,
    fontSize: '14px',
  },
};


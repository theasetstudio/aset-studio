// src/components/CommentsPanel.js

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CommentsPanel({ mediaId, disabled }) {
  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // -------------------------
  // AUTH
  // -------------------------
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data?.session ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // -------------------------
  // LOAD COMMENTS
  // -------------------------
  useEffect(() => {
    let alive = true;

    async function load() {
      if (!mediaId) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("media_comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          user:profiles!media_comments_user_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq("media_id", mediaId)
        .order("created_at", { ascending: true });

      if (!alive) return;

      if (error) {
        console.error("Comments load error:", error);
        setComments([]);
      } else {
        setComments(data ?? []);
      }

      setLoading(false);
    }

    load();

    return () => {
      alive = false;
    };
  }, [mediaId]);

  // -------------------------
  // ADD COMMENT
  // -------------------------
  async function handleSubmit() {
    if (!session?.user?.id) return;
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);

      const { error } = await supabase.from("media_comments").insert({
        media_id: mediaId,
        user_id: session.user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");

      // reload comments
      const { data } = await supabase
        .from("media_comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          user:profiles!media_comments_user_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq("media_id", mediaId)
        .order("created_at", { ascending: true });

      setComments(data ?? []);
    } catch (err) {
      console.error("Comment submit error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div style={{ marginTop: 30 }}>
      <h3>Comments</h3>

      {disabled ? (
        <div style={{ opacity: 0.6, fontSize: 14 }}>
          Comments are disabled for this content.
        </div>
      ) : null}

      {!disabled && session?.user ? (
        <div style={{ marginBottom: 16 }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment…"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #444",
              background: "#111",
              color: "#fff",
              marginBottom: 8,
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#fff",
              color: "#111",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      ) : !disabled ? (
        <div style={{ marginBottom: 16, fontSize: 14, opacity: 0.7 }}>
          Sign in to comment.
        </div>
      ) : null}

      {loading ? (
        <div>Loading comments…</div>
      ) : comments.length === 0 ? (
        <div style={{ opacity: 0.6 }}>No comments yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#222",
                  flexShrink: 0,
                }}
              >
                {c.user?.avatar_url ? (
                  <img
                    src={c.user.avatar_url}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aaa",
                      fontWeight: 600,
                    }}
                  >
                    {(c.user?.display_name || "U")[0]}
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <div style={{ fontWeight: 600 }}>
                  {c.user?.display_name || "User"}
                </div>

                <div style={{ fontSize: 13, opacity: 0.6 }}>
                  {new Date(c.created_at).toLocaleString()}
                </div>

                <div style={{ marginTop: 4 }}>{c.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

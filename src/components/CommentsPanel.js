// src/components/CommentsPanel.js

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CommentsPanel({ mediaId, disabled }) {
  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data?.session ?? null);
    }

    loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadComments() {
      if (!mediaId) {
        setComments([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("media_comments")
        .select(`
          id,
          body,
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

    loadComments();

    return () => {
      alive = false;
    };
  }, [mediaId]);

  async function reloadComments() {
    if (!mediaId) return;

    const { data, error } = await supabase
      .from("media_comments")
      .select(`
        id,
        body,
        created_at,
        user_id,
        user:profiles!media_comments_user_id_fkey (
          display_name,
          avatar_url
        )
      `)
      .eq("media_id", mediaId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Comments reload error:", error);
      setComments([]);
      return;
    }

    setComments(data ?? []);
  }

  async function handleSubmit() {
    if (!session?.user?.id) return;
    if (!mediaId) return;
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);

      const { error } = await supabase.from("media_comments").insert({
        media_id: mediaId,
        user_id: session.user.id,
        body: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      await reloadComments();
    } catch (err) {
      console.error("Comment submit error:", err);
    } finally {
      setSubmitting(false);
    }
  }

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
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: 600,
              opacity: submitting ? 0.7 : 1,
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
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
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
                {comment.user?.avatar_url ? (
                  <img
                    src={comment.user.avatar_url}
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
                    {(comment.user?.display_name || "U")[0]}
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontWeight: 600 }}>
                  {comment.user?.display_name || "User"}
                </div>

                <div style={{ fontSize: 13, opacity: 0.6 }}>
                  {comment.created_at
                    ? new Date(comment.created_at).toLocaleString()
                    : ""}
                </div>

                <div style={{ marginTop: 4 }}>{comment.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
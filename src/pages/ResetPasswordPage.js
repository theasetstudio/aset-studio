// src/pages/ResetPasswordPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function isAbortError(e) {
  return e?.name === "AbortError" || String(e?.message || "").toLowerCase().includes("aborted");
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        // "Wake up" supabase client so it can process recovery tokens
        await supabase.auth.getSession();
      } catch (e) {
        // ignore
      }
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      // Reset links often trigger PASSWORD_RECOVERY
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setMsg("");
        return;
      }

      // Some setups may already have a valid session immediately
      if (session?.user?.id) {
        setReady(true);
      }
    });

    // Backup check (sometimes event doesn't fire instantly)
    const t = setTimeout(async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data?.session?.user?.id) setReady(true);
      } catch (e) {
        // ignore
      }
    }, 350);

    return () => {
      mounted = false;
      clearTimeout(t);
      sub?.subscription?.unsubscribe();
    };
  }, []);

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setMsg("");

    if (!password || password.length < 8) {
      setMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMsg("Password updated. Redirecting to sign in…");

      // Clean up session
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }

      setTimeout(() => navigate("/auth", { replace: true }), 800);
    } catch (e) {
      if (isAbortError(e)) {
        setMsg("Please try again (browser interrupted the request).");
      } else {
        setMsg(e?.message || "Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "40px auto" }}>
      <h2 style={{ marginTop: 0 }}>Reset password</h2>

      {!ready ? (
        <div style={{ fontSize: 13, opacity: 0.85 }}>
          Preparing your reset session…
          <div style={{ marginTop: 10, opacity: 0.75 }}>
            If this never finishes, open the reset link again (or try in an incognito window).
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdatePassword}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>New password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "inherit",
              marginBottom: 10,
            }}
          />

          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Confirm password</label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "inherit",
              marginBottom: 12,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.10)",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}

      {msg ? <p style={{ marginTop: 12, fontSize: 13, opacity: 0.85 }}>{msg}</p> : null}

      <button
        type="button"
        onClick={() => navigate("/auth")}
        style={{
          marginTop: 14,
          background: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          textDecoration: "underline",
          fontSize: 13,
          opacity: 0.85,
        }}
      >
        Back to sign in
      </button>
    </div>
  );
}
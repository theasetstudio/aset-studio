import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function isAbortError(e) {
  return (
    e?.name === "AbortError" ||
    String(e?.message || "").toLowerCase().includes("aborted") ||
    String(e || "").toLowerCase().includes("aborterror") ||
    String(e?.message || "").toLowerCase().includes("signal is aborted")
  );
}

export default function AuthPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("signin"); // signin | signup | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.warn("AuthPage getSession error:", error);
        }

        const existingSession = data?.session || null;

        if (existingSession?.user?.id) {
          setMsg("You are already signed in.");
        }
      } catch (e) {
        if (!isAbortError(e)) {
          console.warn("AuthPage getSession threw:", e);
        }
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session?.user?.id) {
        navigate("/gallery", { replace: true });
      }
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [navigate]);

  async function signIn(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
    } catch (err) {
      setMsg(err?.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function signUp(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMsg(
        "Account created. If email confirmation is enabled, check your email to confirm, then sign in."
      );
    } catch (err) {
      setMsg(err?.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  async function sendPasswordReset(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const cleanEmail = email.trim();

      if (!cleanEmail) {
        setMsg("Enter your email address.");
        return;
      }

      const redirectTo = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo,
      });

      if (error) throw error;

      setMsg("If an account exists for that email, a password reset link has been sent.");
    } catch (err) {
      setMsg(err?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOutCurrentSession() {
    setMsg("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setMsg("Signed out. You can now sign in with another account.");
    } catch (err) {
      setMsg(err?.message || "Sign out failed.");
    } finally {
      setLoading(false);
    }
  }

  const title =
    tab === "signin"
      ? "Sign in"
      : tab === "signup"
      ? "Create account"
      : "Reset password";

  if (checkingSession) {
    return <div style={{ padding: 16, maxWidth: 420, margin: "40px auto" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "40px auto" }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => {
            setTab("signin");
            setMsg("");
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: tab === "signin" ? "rgba(255,255,255,0.12)" : "transparent",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>

        <button
          type="button"
          onClick={() => {
            setTab("signup");
            setMsg("");
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: tab === "signup" ? "rgba(255,255,255,0.12)" : "transparent",
            cursor: "pointer",
          }}
        >
          Sign up
        </button>

        <button
          type="button"
          onClick={() => {
            setTab("forgot");
            setMsg("");
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: tab === "forgot" ? "rgba(255,255,255,0.12)" : "transparent",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          Forgot password
        </button>
      </div>

      {tab !== "forgot" ? (
        <form onSubmit={tab === "signin" ? signIn : signUp}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
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

          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Password</label>
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
            {loading ? "Working..." : tab === "signin" ? "Sign in" : "Create account"}
          </button>

          {tab === "signin" ? (
            <button
              type="button"
              onClick={() => {
                setTab("forgot");
                setMsg("");
              }}
              style={{
                marginTop: 10,
                width: "100%",
                background: "transparent",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: 13,
                opacity: 0.85,
              }}
            >
              Forgot password?
            </button>
          ) : null}
        </form>
      ) : (
        <form onSubmit={sendPasswordReset}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 10 }}>
            Enter your email and we’ll send you a reset link.
          </div>

          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
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
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("signin");
              setMsg("");
            }}
            style={{
              marginTop: 10,
              width: "100%",
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
        </form>
      )}

      {msg ? <p style={{ marginTop: 12, fontSize: 13, opacity: 0.85 }}>{msg}</p> : null}

      <button
        type="button"
        onClick={handleSignOutCurrentSession}
        disabled={loading}
        style={{
          marginTop: 14,
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.06)",
          cursor: "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        Sign out current session
      </button>

      <button
        type="button"
        onClick={() => navigate("/gallery")}
        style={{
          marginTop: 10,
          width: "100%",
          background: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          textDecoration: "underline",
          fontSize: 13,
          opacity: 0.85,
        }}
      >
        Back to gallery
      </button>
    </div>
  );
}
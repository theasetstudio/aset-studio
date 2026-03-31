// src/pages/DebugAuthPage.js
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function DebugAuthPage() {
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;

    async function run() {
      const { data, error } = await supabase.auth.getSession();
      if (!alive) return;

      if (error) console.warn("getSession error:", error);

      const s = data?.session || null;
      setSession(s);

      const uid = s?.user?.id || "";
      const em = s?.user?.email || "";
      setUserId(uid);
      setEmail(em);

      if (!uid) {
        setProfile(null);
        setProfileError("No user session found.");
        return;
      }

      const { data: p, error: pe } = await supabase
        .from("profiles")
        .select("id, display_name, role, is_age_verified")
        .eq("id", uid)
        .single();

      if (!alive) return;

      if (pe) {
        setProfile(null);
        setProfileError({
          message: pe.message,
          details: pe.details,
          hint: pe.hint,
          code: pe.code,
        });
      } else {
        setProfile(p);
        setProfileError(null);
      }
    }

    run();

    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      run();
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  async function forceSignOut() {
    setBusy(true);
    try {
      await supabase.auth.signOut({ scope: "global" });

      // remove Supabase tokens if anything is stuck
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-"))
        .forEach((k) => localStorage.removeItem(k));

      window.location.href = "/auth";
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto", color: "#f2f0ea" }}>
      <h2>Debug Auth</h2>

      <div style={box}>
        <div><strong>Session exists:</strong> {String(!!session)}</div>
        <div><strong>User ID:</strong> {userId || "—"}</div>
        <div><strong>Email:</strong> {email || "—"}</div>
      </div>

      <div style={box}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Profile fetch</div>
        {profile ? (
          <pre style={pre}>{JSON.stringify(profile, null, 2)}</pre>
        ) : (
          <pre style={pre}>{JSON.stringify(profileError, null, 2)}</pre>
        )}
      </div>

      <button onClick={forceSignOut} disabled={busy} style={btn}>
        {busy ? "Signing out…" : "Force Sign Out (Global)"}
      </button>

      <div style={{ marginTop: 12, opacity: 0.75, fontSize: 13 }}>
        If Profile fetch shows an error, it’s almost always RLS blocking SELECT on profiles.
      </div>
    </div>
  );
}

const box = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 14,
  padding: 14,
  marginBottom: 14,
};

const pre = {
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  background: "rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.10)",
  padding: 12,
  borderRadius: 12,
  margin: 0,
};

const btn = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.20)",
  background: "rgba(255,255,255,0.06)",
  color: "#f2f0ea",
  cursor: "pointer",
  fontWeight: 700,
};
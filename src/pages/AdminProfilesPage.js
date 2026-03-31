import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminProfilesPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [myProfile, setMyProfile] = useState(null);

  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState(null);

  const myUserId = session?.user?.id || null;

  const isAdmin = useMemo(() => myProfile?.role === "admin", [myProfile]);

  /* ---------------- Auth ---------------- */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session || null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s || null);
    });

    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  /* ---------------- Load my profile (role check) ---------------- */

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setMsg("");
      if (!myUserId) {
        setMyProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, supreme_access, supreme_access_expires_at, username, display_name")
        .eq("id", myUserId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setMyProfile(null);
        setMsg(error.message || "Failed to load your profile.");
        return;
      }

      setMyProfile(data || null);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [myUserId]);

  /* ---------------- Load all profiles (admin-only) ---------------- */

  const loadProfiles = async () => {
    setLoading(true);
    setMsg("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, role, supreme_access, supreme_access_expires_at, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setMsg(error.message || "Failed to load profiles.");
        setProfiles([]);
        return;
      }

      setProfiles(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only load the list if user is admin
    if (!isAdmin) return;
    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  /* ---------------- Actions ---------------- */

  const toggleSupreme = async (p) => {
    if (!p?.id) return;
    setBusyId(p.id);
    setMsg("");

    try {
      const nextVal = !p.supreme_access;

      const { error } = await supabase
        .from("profiles")
        .update({ supreme_access: nextVal })
        .eq("id", p.id);

      if (error) {
        setMsg(error.message || "Update failed.");
        return;
      }

      // update local list
      setProfiles((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, supreme_access: nextVal } : x))
      );
    } finally {
      setBusyId(null);
    }
  };

  const clearExpires = async (p) => {
    if (!p?.id) return;
    setBusyId(p.id);
    setMsg("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ supreme_access_expires_at: null })
        .eq("id", p.id);

      if (error) {
        setMsg(error.message || "Update failed.");
        return;
      }

      setProfiles((prev) =>
        prev.map((x) =>
          x.id === p.id ? { ...x, supreme_access_expires_at: null } : x
        )
      );
    } finally {
      setBusyId(null);
    }
  };

  /* ---------------- Filter ---------------- */

  const filtered = useMemo(() => {
    const s = (search || "").trim().toLowerCase();
    if (!s) return profiles;

    return profiles.filter((p) => {
      const a = (p.username || "").toLowerCase();
      const b = (p.display_name || "").toLowerCase();
      const c = (p.role || "").toLowerCase();
      const d = (p.id || "").toLowerCase();
      return a.includes(s) || b.includes(s) || c.includes(s) || d.includes(s);
    });
  }, [profiles, search]);

  /* ---------------- Render ---------------- */

  if (!session) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Admin • Profiles</h2>
        <div>Please sign in to continue.</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Admin • Profiles</h2>
        <div style={{ color: "crimson", marginTop: 8 }}>
          Not authorized.
        </div>
        {msg ? <div style={{ marginTop: 8 }}>{msg}</div> : null}
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin • Profiles</h2>

      {msg ? (
        <div style={{ marginBottom: 12, color: "crimson" }}>{msg}</div>
      ) : null}

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search username / display name / role / id…"
          style={{
            width: "100%",
            maxWidth: 520,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={loadProfiles}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Refresh
        </button>
      </div>

      {loading ? <div>Loading…</div> : null}

      {!loading && filtered.length === 0 ? <div>No profiles found.</div> : null}

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map((p) => {
          const isBusy = busyId === p.id;
          const expires = p.supreme_access_expires_at
            ? new Date(p.supreme_access_expires_at).toLocaleString()
            : "—";

          return (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 800 }}>
                {p.display_name || p.username || "(no name)"}{" "}
                <span style={{ fontWeight: 400, opacity: 0.7 }}>
                  • {p.role || "user"}
                </span>
              </div>

              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                id: {p.id}
              </div>

              <div style={{ marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>supreme_access</div>
                  <div style={{ fontWeight: 800 }}>
                    {p.supreme_access ? "true" : "false"}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>supreme_access_expires_at</div>
                  <div style={{ fontWeight: 800 }}>{expires}</div>
                </div>
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => toggleSupreme(p)}
                  disabled={isBusy}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    cursor: isBusy ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {isBusy ? "Working…" : p.supreme_access ? "Revoke Supreme" : "Grant Supreme"}
                </button>

                <button
                  onClick={() => clearExpires(p)}
                  disabled={isBusy}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    cursor: isBusy ? "not-allowed" : "pointer",
                  }}
                >
                  {isBusy ? "Working…" : "Clear Expiration"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

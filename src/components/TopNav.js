// src/components/TopNav.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

function norm(v) {
  return String(v || "").trim().toLowerCase();
}

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(false);

  // Optional: show Admin link only if admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const s = data?.session || null;
      setSession(s);

      const userId = s?.user?.id;
      if (userId) {
        const { data: p, error } = await supabase.from("profiles").select("role").eq("id", userId).single();
        if (!mounted) return;
        if (!error) setIsAdmin(norm(p?.role) === "admin");
        else setIsAdmin(false);
      } else {
        setIsAdmin(false);
      }
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (!mounted) return;
      setSession(s || null);

      const userId = s?.user?.id;
      if (userId) {
        const { data: p, error } = await supabase.from("profiles").select("role").eq("id", userId).single();
        if (!mounted) return;
        if (!error) setIsAdmin(norm(p?.role) === "admin");
        else setIsAdmin(false);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // Hide nav on homepage to preserve cinematic landing
  if (location.pathname === "/") return null;

  // ✅ Active link helper:
  // exact paths like "/gallery"
  // prefix paths like "/sirens-realm" should also be active for "/sirens-realm/stones"
  const isActive = (path, { prefix = false } = {}) => {
    if (!prefix) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await supabase.auth.signOut();

      // ✅ launch-stable “hard reset” so UI never gets stuck
      window.location.href = "/";
    } finally {
      setBusy(false);
    }
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          THE ASET STUDIO
        </Link>

        <div style={styles.links}>
          <Link
            to="/gallery"
            style={{ ...styles.link, ...(isActive("/gallery") ? styles.linkActive : {}) }}
          >
            Gallery
          </Link>

          <Link
            to="/featured"
            style={{ ...styles.link, ...(isActive("/featured") ? styles.linkActive : {}) }}
          >
            Featured
          </Link>

          <Link
            to="/favorites"
            style={{ ...styles.link, ...(isActive("/favorites") ? styles.linkActive : {}) }}
          >
            Favorites
          </Link>

          <Link
            to="/reviews"
            style={{ ...styles.link, ...(isActive("/reviews") ? styles.linkActive : {}) }}
          >
            Reviews
          </Link>

          <Link
            to="/supreme"
            style={{ ...styles.linkGold, ...(isActive("/supreme") ? styles.linkGoldActive : {}) }}
          >
            Supreme
          </Link>

          <Link
            to="/creators-corner"
            style={{ ...styles.link, ...(isActive("/creators-corner") ? styles.linkActive : {}) }}
          >
            Creators Corner
          </Link>

          <Link
            to="/sirens-realm"
            style={{ ...styles.link, ...(isActive("/sirens-realm", { prefix: true }) ? styles.linkActive : {}) }}
          >
            Sirens Realm
          </Link>

          {/* ✅ Admin link (only show if admin) */}
          {isAdmin ? (
            <Link
              to="/admin"
              style={{ ...styles.link, ...(isActive("/admin", { prefix: true }) ? styles.linkActive : {}) }}
            >
              Admin
            </Link>
          ) : null}
        </div>

        <div style={styles.right}>
          {session ? (
            <button onClick={handleSignOut} disabled={busy} style={styles.authBtn}>
              {busy ? "Signing out…" : "Sign Out"}
            </button>
          ) : (
            <button onClick={handleSignIn} style={styles.authBtn}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(10px)",
    background: "rgba(7,7,10,0.75)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  brand: {
    textDecoration: "none",
    color: "#f2f0ea",
    letterSpacing: "0.2em",
    fontSize: 12,
    whiteSpace: "nowrap",
  },

  links: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  link: {
    textDecoration: "none",
    color: "rgba(242,240,234,0.92)",
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 10,
    transition: "background 120ms ease, border-color 120ms ease",
    border: "1px solid transparent",
  },

  linkActive: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
  },

  linkGold: {
    textDecoration: "none",
    color: "#f2f0ea",
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 10,
    background: "rgba(212,175,55,0.15)",
    border: "1px solid rgba(212,175,55,0.45)",
    transition: "background 120ms ease, border-color 120ms ease",
  },

  linkGoldActive: {
    background: "rgba(212,175,55,0.22)",
    border: "1px solid rgba(212,175,55,0.60)",
  },

  right: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
  },

  authBtn: {
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#f2f0ea",
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
};
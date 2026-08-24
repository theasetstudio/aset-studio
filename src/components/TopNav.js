import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../supabaseClient";

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(
          data?.session?.user || null
        );
      }
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user || null
          );
        }
      );

    return () => {
      active = false;

      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate("/");
  };

  const isAdminArea =
    location.pathname.startsWith("/admin");

  const isExpressionVault =
    location.pathname ===
    "/studio/expression-vault";

  const isServices =
    location.pathname === "/services";

  const isAfterDark =
    location.pathname === "/after-dark";

  const isHomePage =
    location.pathname === "/";

  if (isAdminArea) {
    return null;
  }

  const navStyle = {
    ...styles.nav,
    ...(isHomePage
      ? styles.navHome
      : styles.navInner),
  };

  const logoStyle = {
    ...styles.logo,
    ...(isHomePage
      ? styles.logoHome
      : {}),
  };

  return (
    <div style={navStyle}>
      <div
        style={logoStyle}
        onClick={() =>
          navigate("/")
        }
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();

            navigate("/");
          }
        }}
        role="button"
        tabIndex={0}
      >
        THE ASET STUDIO
      </div>

      <div style={styles.actions}>
        <button
          type="button"
          style={{
            ...styles.button,
            ...(isExpressionVault
              ? styles.activeButton
              : {}),
          }}
          onClick={() =>
            navigate(
              "/studio/expression-vault"
            )
          }
        >
          Expression Vault
        </button>

        <button
          type="button"
          style={{
            ...styles.button,
            ...(isServices
              ? styles.activeButton
              : {}),
          }}
          onClick={() =>
            navigate("/services")
          }
        >
          Services
        </button>

        <button
          type="button"
          style={{
            ...styles.button,
            ...styles.afterDarkButton,
            ...(isAfterDark
              ? styles.afterDarkActiveButton
              : {}),
          }}
          onClick={() =>
            navigate("/after-dark")
          }
        >
          After Dark
          <span style={styles.ageBadge}>
            18+
          </span>
        </button>

        {user ? (
          <>
            <button
              type="button"
              style={styles.button}
              onClick={() =>
                navigate("/creator-hub")
              }
            >
              Hub
            </button>

            <button
              type="button"
              style={styles.button}
              onClick={
                handleLogout
              }
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            style={styles.button}
            onClick={() =>
              navigate("/auth")
            }
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    width: "100%",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "14px 18px",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    flexWrap: "wrap",
    boxSizing: "border-box",
    gap: "10px",
    backdropFilter:
      "blur(22px)",
    WebkitBackdropFilter:
      "blur(22px)",
    borderBottom:
      "1px solid rgba(212, 175, 55, 0.12)",
    boxShadow:
      "0 10px 30px rgba(0, 0, 0, 0.22)",
  },

  navHome: {
    background:
      "linear-gradient(to bottom, rgba(5, 5, 7, 0.88), rgba(5, 5, 7, 0.42))",
  },

  navInner: {
    background:
      "rgba(5, 5, 7, 0.88)",
  },

  logo: {
    fontSize: "12px",
    letterSpacing: "2px",
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  logoHome: {
    color: "#f2f0ea",
    textShadow:
      "0 1px 10px rgba(0,0,0,0.35)",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    background:
      "rgba(18, 18, 20, 0.68)",
    color: "white",
    border:
      "1px solid rgba(255,255,255,0.12)",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "12px",
    whiteSpace: "nowrap",
    backdropFilter:
      "blur(12px)",
    WebkitBackdropFilter:
      "blur(12px)",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.18)",
    transition:
      "all 0.2s ease",
  },

  activeButton: {
    border:
      "1px solid rgba(212, 175, 55, 0.62)",
    color: "#e7d2a2",
    boxShadow:
      "0 0 0 1px rgba(214,195,165,0.15) inset, 0 6px 18px rgba(0,0,0,0.18)",
  },

  afterDarkButton: {
    background:
      "linear-gradient(145deg, rgba(30,30,30,0.95), rgba(8,8,8,0.95))",
    border:
      "1px solid rgba(255,255,255,0.16)",
    color: "#ededed",
  },

  afterDarkActiveButton: {
    border:
      "1px solid rgba(255,255,255,0.38)",
    color: "#ffffff",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.08) inset, 0 6px 18px rgba(0,0,0,0.26)",
  },

  ageBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "26px",
    height: "18px",
    padding: "0 5px",
    borderRadius: "999px",
    border:
      "1px solid rgba(255,255,255,0.22)",
    color: "#bdbdbd",
    fontSize: "8px",
    fontWeight: 900,
    letterSpacing: "0.05em",
  },
};
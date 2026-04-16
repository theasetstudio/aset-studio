import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const isExpressionVault =
    location.pathname === "/studio/expression-vault";

  return (
    <div style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate("/")}>
        THE ASET STUDIO
      </div>

      <div style={styles.actions}>
        <button
          style={{
            ...styles.button,
            ...(isExpressionVault ? styles.activeButton : {}),
          }}
          onClick={() => navigate("/studio/expression-vault")}
        >
          Expression Vault
        </button>

        {user ? (
          <>
            <button
              style={styles.button}
              onClick={() => navigate("/creator-hub")}
            >
              Hub
            </button>

            <button style={styles.button} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button style={styles.button} onClick={() => navigate("/auth")}>
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "black",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    flexWrap: "wrap",
    boxSizing: "border-box",
    gap: "10px",
  },

  logo: {
    fontSize: "12px",
    letterSpacing: "2px",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  button: {
    background: "#1a1a1a",
    color: "white",
    border: "1px solid #333",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  activeButton: {
    border: "1px solid #8f7a5a",
    color: "#d6c3a5",
    boxShadow: "0 0 0 1px rgba(214,195,165,0.15) inset",
  },
};
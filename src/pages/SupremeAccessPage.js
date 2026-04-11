import React from "react";

export default function SupremeAccessPage() {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.card}>
          <div style={styles.eyebrow}>SUPREME ACCESS</div>

          <h1 style={styles.title}>Supreme Access is temporarily unavailable</h1>

          <p style={styles.text}>
            This section is being prepared and is currently hidden from public
            access. Please check back soon.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "clamp(24px, 5vw, 40px) 16px 48px",
    background:
      "radial-gradient(circle at top, rgba(32,32,40,0.55) 0%, rgba(8,8,10,1) 55%, rgba(3,3,5,1) 100%)",
    color: "#f5f5f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  inner: {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto",
  },

  card: {
    borderRadius: "24px",
    border: "1px solid #242735",
    background: "rgba(9,10,14,0.92)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
    padding: "clamp(24px, 4vw, 40px)",
    textAlign: "center",
  },

  eyebrow: {
    letterSpacing: "0.2em",
    fontSize: "12px",
    color: "rgba(245,245,247,0.78)",
    marginBottom: 12,
  },

  title: {
    margin: 0,
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: 800,
    lineHeight: 1.15,
  },

  text: {
    margin: "16px auto 0",
    maxWidth: "560px",
    color: "#b6b6c4",
    fontSize: "15px",
    lineHeight: 1.7,
  },
};

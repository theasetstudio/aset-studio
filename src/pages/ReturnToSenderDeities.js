// src/pages/ReturnToSenderDeities.js
import React from "react";

export default function ReturnToSenderDeities() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.eyebrow}>RETURN TO SENDER</div>

        <h1 style={styles.title}>
          Deities and Forces
        </h1>

        <div style={styles.list}>

          <div style={styles.item}>Nemesis</div>
          <div style={styles.item}>Zeus</div>
          <div style={styles.item}>Hekate</div>
          <div style={styles.item}>Kali</div>
          <div style={styles.item}>Ma'at</div>
          <div style={styles.item}>Oya</div>
          <div style={styles.item}>Ogun</div>
          <div style={styles.item}>Elegua</div>
          <div style={styles.item}>Shango</div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(60% 60% at 50% 30%, rgba(120,90,255,0.18), rgba(0,0,0,1) 70%)",
    color: "white",
    padding: "48px 20px",
  },

  container: {
    maxWidth: 900,
    margin: "0 auto",
  },

  eyebrow: {
    letterSpacing: 3,
    fontSize: 12,
    opacity: 0.8,
  },

  title: {
    fontSize: "clamp(2.2rem, 5vw, 46px)",
    marginTop: 16,
    marginBottom: 30,
  },

  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },

  item: {
    padding: "18px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(0,0,0,0.35)",
    textAlign: "center",
    fontSize: 18,
    fontWeight: 600,
  },
};
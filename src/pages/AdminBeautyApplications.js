import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminBeautyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("beauty_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading beauty applications:", error);
      setMessage("Could not load applications.");
      setLoading(false);
      return;
    }

    setApplications(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    setMessage("");

    const { error } = await supabase
      .from("beauty_applications")
      .update({ application_status: status })
      .eq("id", id);

    if (error) {
      console.error("Error updating application:", error);
      setMessage("Could not update application.");
      return;
    }

    setMessage(`Application marked as ${status}.`);
    fetchApplications();
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <p style={styles.eyebrow}>THE ASET STUDIO ADMIN</p>

        <h1 style={styles.title}>Beauty Applications</h1>

        <p style={styles.subtitle}>
          Review submissions for Aset Beauty Collective.
        </p>

        <button onClick={fetchApplications} style={styles.refreshButton}>
          Refresh
        </button>
      </section>

      <section style={styles.section}>
        {message && <div style={styles.message}>{message}</div>}

        {loading ? (
          <p style={styles.emptyText}>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p style={styles.emptyText}>No applications yet.</p>
        ) : (
          <div style={styles.grid}>
            {applications.map((application) => (
              <article key={application.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <p style={styles.cardLabel}>
                      {application.application_type || "application"}
                    </p>

                    <h2 style={styles.cardTitle}>{application.name}</h2>

                    <p style={styles.cardMeta}>{application.category}</p>
                  </div>

                  <span style={styles.statusBadge}>
                    {application.application_status}
                  </span>
                </div>

                <div style={styles.infoGrid}>
                  <p>
                    <strong>Location:</strong>{" "}
                    {application.city}, {application.state_region},{" "}
                    {application.country}
                  </p>

                  <p>
                    <strong>Email:</strong> {application.email}
                  </p>

                  {application.phone && (
                    <p>
                      <strong>Phone:</strong> {application.phone}
                    </p>
                  )}

                  {application.website && (
                    <p>
                      <strong>Website:</strong>{" "}
                      <a
                        href={application.website}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.link}
                      >
                        Open Website
                      </a>
                    </p>
                  )}

                  {application.instagram && (
                    <p>
                      <strong>Instagram:</strong> {application.instagram}
                    </p>
                  )}

                  {application.portfolio_link && (
                    <p>
                      <strong>Portfolio:</strong>{" "}
                      <a
                        href={application.portfolio_link}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.link}
                      >
                        Open Portfolio
                      </a>
                    </p>
                  )}
                </div>

                <div style={styles.introBox}>
                  <strong>Introduction</strong>
                  <p>{application.introduction}</p>
                </div>

                <div style={styles.actions}>
                  <button
                    onClick={() => updateStatus(application.id, "approved")}
                    style={styles.approveButton}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(application.id, "rejected")}
                    style={styles.rejectButton}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => updateStatus(application.id, "pending")}
                    style={styles.pendingButton}
                  >
                    Pending
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#f6f1e8",
    fontFamily: "inherit",
    paddingTop: "90px",
  },

  header: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "70px 24px 40px",
  },

  eyebrow: {
    letterSpacing: "0.24em",
    fontSize: "0.72rem",
    color: "#c9a66b",
    marginBottom: "14px",
  },

  title: {
    fontSize: "clamp(2.8rem, 6vw, 5.8rem)",
    lineHeight: 0.95,
    margin: "0 0 20px",
    fontWeight: 500,
  },

  subtitle: {
    maxWidth: "760px",
    fontSize: "1rem",
    lineHeight: 1.8,
    color: "rgba(246,241,232,0.72)",
    marginBottom: "24px",
  },

  refreshButton: {
    padding: "12px 22px",
    background: "transparent",
    border: "1px solid rgba(201,166,107,0.7)",
    color: "#f6f1e8",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontSize: "0.72rem",
    cursor: "pointer",
  },

  section: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "30px 24px 120px",
  },

  message: {
    marginBottom: "24px",
    padding: "14px",
    border: "1px solid rgba(201,166,107,0.35)",
    background: "rgba(201,166,107,0.08)",
  },

  emptyText: {
    color: "rgba(246,241,232,0.7)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
  },

  card: {
    border: "1px solid rgba(201,166,107,0.24)",
    background: "rgba(255,255,255,0.035)",
    padding: "28px",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
    marginBottom: "22px",
  },

  cardLabel: {
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontSize: "0.65rem",
    color: "#c9a66b",
    marginBottom: "10px",
  },

  cardTitle: {
    fontSize: "1.8rem",
    margin: "0 0 8px",
    fontWeight: 500,
  },

  cardMeta: {
    color: "rgba(246,241,232,0.65)",
    margin: 0,
  },

  statusBadge: {
    border: "1px solid rgba(201,166,107,0.35)",
    padding: "8px 12px",
    color: "#c9a66b",
    textTransform: "uppercase",
    fontSize: "0.68rem",
    letterSpacing: "0.12em",
    whiteSpace: "nowrap",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "10px 22px",
    color: "rgba(246,241,232,0.72)",
    lineHeight: 1.6,
  },

  link: {
    color: "#c9a66b",
  },

  introBox: {
    marginTop: "24px",
    padding: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(246,241,232,0.76)",
    lineHeight: 1.7,
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "24px",
  },

  approveButton: {
    padding: "12px 18px",
    background: "rgba(201,166,107,0.16)",
    border: "1px solid rgba(201,166,107,0.7)",
    color: "#f6f1e8",
    cursor: "pointer",
  },

  rejectButton: {
    padding: "12px 18px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#f6f1e8",
    cursor: "pointer",
  },

  pendingButton: {
    padding: "12px 18px",
    background: "transparent",
    border: "1px solid rgba(201,166,107,0.35)",
    color: "#c9a66b",
    cursor: "pointer",
  },
};
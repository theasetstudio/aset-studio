import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading inquiries:", error);
      setInquiries([]);
      setLoading(false);
      return;
    }

    setInquiries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin — Service Inquiries</h1>

      {loading ? (
        <p style={styles.text}>Loading inquiries...</p>
      ) : inquiries.length === 0 ? (
        <p style={styles.text}>No inquiries yet.</p>
      ) : (
        <div style={styles.grid}>
          {inquiries.map((item) => (
            <div key={item.id} style={styles.card}>
              <p style={styles.label}>Name</p>
              <p style={styles.value}>{item.name || "Not provided"}</p>

              <p style={styles.label}>Email</p>
              <p style={styles.value}>{item.email || "Not provided"}</p>

              <p style={styles.label}>Message</p>
              <p style={styles.message}>{item.message}</p>

              <p style={styles.date}>
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "60px 24px",
    fontFamily: "Georgia, serif",
  },

  title: {
    fontSize: "34px",
    color: "#d8b06a",
    marginBottom: "30px",
  },

  text: {
    color: "#ccc",
    fontSize: "18px",
  },

  grid: {
    display: "grid",
    gap: "20px",
  },

  card: {
    background: "#111",
    border: "1px solid #333",
    borderRadius: "14px",
    padding: "22px",
  },

  label: {
    color: "#d8b06a",
    fontSize: "14px",
    marginBottom: "4px",
  },

  value: {
    color: "#fff",
    marginBottom: "16px",
  },

  message: {
    color: "#ddd",
    lineHeight: "1.7",
    marginBottom: "16px",
  },

  date: {
    color: "#888",
    fontSize: "12px",
    marginTop: "16px",
  },
};
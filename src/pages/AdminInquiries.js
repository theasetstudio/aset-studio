import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inquiries");
      return;
    }

    setInquiries(data);
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin — Inquiries</h1>

      {loading ? (
        <p>Loading...</p>
      ) : inquiries.length === 0 ? (
        <p>No inquiries yet</p>
      ) : (
        <div style={styles.list}>
          {inquiries.map((item) => (
            <div key={item.id} style={styles.card}>
              <p><strong>Name:</strong> {item.name || "—"}</p>
              <p><strong>Email:</strong> {item.email || "—"}</p>
              <p><strong>Message:</strong> {item.message}</p>
              <p style={styles.date}>
                {new Date(item.created_at).toLocaleString()}
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
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Georgia, serif",
  },

  title: {
    fontSize: "32px",
    marginBottom: "30px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  card: {
    border: "1px solid #333",
    padding: "20px",
    borderRadius: "12px",
    background: "#111",
  },

  date: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#888",
  },
};
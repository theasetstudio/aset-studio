import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminPanel() {
  const [pendingMedia, setPendingMedia] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadPendingMedia();
    loadPendingReviews();
  }, []);

  const loadPendingMedia = async () => {
    const { data, error } = await supabase
      .from("media_items")
      .select("id, title, category, gallery, status")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPendingMedia(data || []);
  };

  const loadPendingReviews = async () => {
    const { data, error } = await supabase
      .from("service_reviews")
      .select("id, rating, comment, status")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPendingReviews(data || []);
  };

  const approveMedia = async (id) => {
    const { error } = await supabase
      .from("media_items")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadPendingMedia();
  };

  const rejectMedia = async (id) => {
    const { error } = await supabase
      .from("media_items")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadPendingMedia();
  };

  const approveReview = async (id) => {
    const { error } = await supabase
      .from("service_reviews")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadPendingReviews();
  };

  const rejectReview = async (id) => {
    const { error } = await supabase
      .from("service_reviews")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadPendingReviews();
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1>Admin Panel</h1>

      {status && <div>{status}</div>}

      <h2>Pending Media Uploads</h2>

      {pendingMedia.length === 0 ? (
        <p>No pending media.</p>
      ) : (
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Gallery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingMedia.map((media) => (
              <tr key={media.id}>
                <td>{media.title || "(no title)"}</td>
                <td>{media.category}</td>
                <td>{media.gallery}</td>
                <td>
                  <button onClick={() => approveMedia(media.id)}>
                    Approve
                  </button>{" "}
                  <button onClick={() => rejectMedia(media.id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: 40 }}>Pending Service Reviews</h2>

      {pendingReviews.length === 0 ? (
        <p>No pending reviews.</p>
      ) : (
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>
                  <button onClick={() => approveReview(review.id)}>
                    Approve
                  </button>{" "}
                  <button onClick={() => rejectReview(review.id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

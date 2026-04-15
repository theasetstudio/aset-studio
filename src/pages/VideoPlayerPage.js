import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./VideoPlayerPage.css";

export default function VideoPlayerPage() {
  const { slug } = useParams();

  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [related, setRelated] = useState([]);
  const [moreLikeThis, setMoreLikeThis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadVideo() {
      setLoading(true);

      // 1. Get main video
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("slug", slug)
        .eq("type", "video")
        .single();

      if (error || !data) {
        console.error("Video not found:", error);
        setLoading(false);
        return;
      }

      if (!isMounted) return;

      setVideo(data);

      // 2. Signed URL
      const { data: signed } = await supabase.storage
        .from("media")
        .createSignedUrl(data.file_path, 60 * 60);

      if (signed?.signedUrl) {
        setVideoUrl(signed.signedUrl);
      }

      // 3. Related (same tags basic match)
      let relatedQuery = supabase
        .from("media_items")
        .select("id, title, slug, category")
        .eq("type", "video")
        .neq("slug", slug)
        .limit(6);

      if (data.tags && data.tags.length > 0) {
        relatedQuery = relatedQuery.contains("tags", data.tags);
      }

      const { data: relatedData } = await relatedQuery;

      // 4. More like this (same category)
      const { data: moreData } = await supabase
        .from("media_items")
        .select("id, title, slug, category")
        .eq("type", "video")
        .eq("category", data.category)
        .neq("slug", slug)
        .limit(6);

      if (isMounted) {
        setRelated(relatedData || []);
        setMoreLikeThis(moreData || []);
        setLoading(false);
      }
    }

    loadVideo();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="video-loading">Loading...</div>;
  }

  if (!video) {
    return <div className="video-error">Video not found</div>;
  }

  return (
    <div className="video-player-page">
      {/* VIDEO */}
      <div className="video-container">
        <video
          className="main-video"
          src={videoUrl}
          controls
          autoPlay
        />
      </div>

      {/* DETAILS */}
      <div className="video-details">
        <h1>{video.title}</h1>
        <p>{video.description}</p>
      </div>

      {/* RELATED */}
      <div className="video-section">
        <h2>Related Interviews</h2>
        <div className="video-row">
          {related.map((item) => (
            <Link key={item.id} to={`/video/${item.slug}`} className="video-link">
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      {/* MORE LIKE THIS */}
      <div className="video-section">
        <h2>More Like This</h2>
        <div className="video-row">
          {moreLikeThis.map((item) => (
            <Link key={item.id} to={`/video/${item.slug}`} className="video-link">
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
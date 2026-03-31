import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function CreatorUploadPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [quote, setQuote] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [accessLevel, setAccessLevel] = useState("public");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfileForUser(authUser) {
      if (!active) return;

      if (!authUser) {
        setUser(null);
        setProfile(null);
        setCheckingAccess(false);
        return;
      }

      setUser(authUser);

      // TEMPORARY ADMIN BYPASS
      const normalizedEmail = String(authUser.email || "").toLowerCase();
      if (normalizedEmail === "aset.consultations@gmail.com") {
        setProfile({ id: authUser.id, role: "admin" });
        setCheckingAccess(false);
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", authUser.id)
          .single();

        if (!active) return;

        if (profileError) {
          console.error("Creator upload profile load failed:", profileError);
          setProfile(null);
        } else {
          setProfile(profileData || null);
        }
      } catch (err) {
        console.error("Creator upload profile request failed:", err);
        if (!active) return;
        setProfile(null);
      } finally {
        if (active) setCheckingAccess(false);
      }
    }

    async function initializeAccess() {
      try {
        setCheckingAccess(true);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        await loadProfileForUser(session?.user || null);
      } catch (err) {
        console.error("Creator upload access init failed:", err);
        if (!active) return;
        setUser(null);
        setProfile(null);
        setCheckingAccess(false);
      }
    }

    initializeAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      await loadProfileForUser(session?.user || null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const role = String(profile?.role || "").toLowerCase();

  async function handleUpload(e) {
    e.preventDefault();

    if (!user) {
      setMessage("Please sign in.");
      return;
    }

    if (role !== "creator" && role !== "admin") {
      setMessage("You must be a creator to upload.");
      return;
    }

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    if (!title.trim()) {
      setMessage("Please enter a title.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const { error: insertError } = await supabase.from("media_items").insert({
        title: title.trim(),
        tagline: tagline.trim() || null,
        quote: quote.trim() || null,
        category: category.trim() || null,
        tags: parsedTags,
        access_level: accessLevel,
        file_path: filePath,
        owner_id: user.id,
        status: "pending",
        hidden: false,
      });

      if (insertError) {
        await supabase.storage.from("media").remove([filePath]);
        throw insertError;
      }

      setMessage("Upload submitted for review.");
      setFile(null);
      setTitle("");
      setTagline("");
      setQuote("");
      setCategory("");
      setTags("");
      setAccessLevel("public");

      const fileInput = document.getElementById("creator-upload-file-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Creator upload failed:", err);
      setMessage(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (checkingAccess) return <div style={{ padding: 16 }}>Checking access...</div>;
  if (!user) return <div style={{ padding: 16 }}>Please sign in.</div>;
  if (role !== "creator" && role !== "admin")
    return <div style={{ padding: 16 }}>You must be a creator to upload.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h1>Creator Upload</h1>
      <form onSubmit={handleUpload} style={{ display: "grid", gap: 12 }}>
        <input
          id="creator-upload-file-input"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input
          placeholder="Tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
        <input placeholder="Quote" value={quote} onChange={(e) => setQuote(e.target.value)} />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
          <option value="public">Public</option>
          <option value="supreme">Supreme</option>
        </select>
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
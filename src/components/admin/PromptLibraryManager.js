import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function PromptLibraryManager() {
  const [prompts, setPrompts] = useState([]);
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPrompts();
  }, []);

  async function loadPrompts() {
    const { data, error } = await supabase
      .from("prompt_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading prompts:", error);
      return;
    }

    setPrompts(data || []);
  }

  async function uploadImage(file) {
    if (!file) return null;

    const filePath = `prompts/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("media")
      .upload(filePath, file);

    if (error) {
      console.error("Image upload error:", error);
      return null;
    }

    return filePath;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    let imagePath = null;

    if (imageFile) {
      imagePath = await uploadImage(imageFile);
    }

    const { error } = await supabase.from("prompt_library").insert([
      {
        title: title,
        prompt_text: promptText,
        category: category,
        status: status,
        image_path: imagePath,
        published_at: status === "published" ? new Date() : null
      }
    ]);

    if (error) {
      console.error("Insert error:", error);
      setLoading(false);
      return;
    }

    setTitle("");
    setPromptText("");
    setCategory("");
    setImageFile(null);
    setStatus("draft");

    await loadPrompts();
    setLoading(false);
  }

  async function deletePrompt(id) {
    const confirmDelete = window.confirm("Delete this prompt?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("prompt_library")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    loadPrompts();
  }

  async function togglePublish(prompt) {
    const newStatus = prompt.status === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("prompt_library")
      .update({
        status: newStatus,
        published_at: newStatus === "published" ? new Date() : null
      })
      .eq("id", prompt.id);

    if (error) {
      console.error("Publish toggle error:", error);
      return;
    }

    loadPrompts();
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Prompt Library Manager</h2>

      {/* Create Prompt Form */}

      <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>

        <input
          type="text"
          placeholder="Prompt title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <textarea
          placeholder="Prompt text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows="6"
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          style={{ marginBottom: 10 }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ marginBottom: 10 }}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Prompt"}
        </button>

      </form>

      {/* Prompt List */}

      <h3>Existing Prompts</h3>

      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          style={{
            border: "1px solid #333",
            padding: 15,
            marginBottom: 15
          }}
        >

          <h4>{prompt.title}</h4>

          <p>
            <strong>Category:</strong> {prompt.category || "None"}
          </p>

          <p>
            <strong>Status:</strong> {prompt.status}
          </p>

          <p style={{ whiteSpace: "pre-wrap" }}>
            {prompt.prompt_text.substring(0, 200)}...
          </p>

          <button onClick={() => togglePublish(prompt)}>
            {prompt.status === "published" ? "Unpublish" : "Publish"}
          </button>

          <button
            onClick={() => deletePrompt(prompt.id)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </button>

        </div>
      ))}
    </div>
  );
}
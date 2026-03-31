import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import * as mediaUploads from "../lib/mediaUploads";

// Admin-controlled category list (fixed list in UI)
const CATEGORIES = ["Boudoir", "Portrait", "Fashion", "Art", "Other"];

export default function UploadTest() {
  const [session, setSession] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [email, setEmail] = useState("admin@asetstudio.local");
  const [password, setPassword] = useState("ChangeThisPassword123!");

  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(CATEGORIES[0]);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    // Recover any existing session on load
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) console.error("getSession error:", error.message);
      setSession(data?.session ?? null);
      setUserEmail(data?.session?.user?.email ?? "");
    });

    // Keep session in sync
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUserEmail(newSession?.user?.email ?? "");
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogin = async () => {
    setError("");
    setStatus("");
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setAuthLoading(false);
        return;
      }

      setSession(data.session);
      setUserEmail(data?.user?.email ?? "");
      setStatus(`Logged in as ${data?.user?.email ?? "unknown"}`);
    } catch (e) {
      setError(e?.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setError("");
    setStatus("");
    await supabase.auth.signOut();
    setSession(null);
    setUserEmail("");
    setStatus("Logged out");
  };

  const pickUploadFunction = () => {
    return mediaUploads.uploadWatermarkedAndCreateMediaItem;
  };

  const handleUpload = async () => {
    setError("");
    setStatus("");

    if (!session) {
      setError("Auth session missing. Please login first.");
      return;
    }

    if (!file) {
      setError("Choose a file first.");
      return;
    }

    const uploadFn = pickUploadFunction();

    try {
      setStatus("Uploading...");

      let result;
      try {
        result = await uploadFn(file, { category });
      } catch (err1) {
        result = await uploadFn({ file, category });
      }

      setStatus("Upload complete ✅");
      console.log("Upload result:", result);
    } catch (e) {
      console.error("Upload error:", e);
      setError(e?.message || "Upload failed (see console)");
      setStatus("");
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "24px auto", padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2 style={{ marginTop: 0 }}>Upload Test</h2>

      {/* AUTH PANEL */}
      <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <strong>Auth status:</strong>{" "}
          {session ? (
            <span>✅ Signed in as {userEmail || "unknown"}</span>
          ) : (
            <span>❌ Not signed in</span>
          )}
        </div>

        {!session ? (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                style={{ flex: 1, padding: 8 }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                type="password"
                style={{ flex: 1, padding: 8 }}
              />
            </div>

            <button onClick={handleLogin} disabled={authLoading} style={{ padding: "8px 12px" }}>
              {authLoading ? "Logging in..." : "Login (dev)"}
            </button>
          </>
        ) : (
          <button onClick={handleLogout} style={{ padding: "8px 12px" }}>
            Logout
          </button>
        )}
      </div>

      {/* UPLOAD PANEL */}
      <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            <strong>Category</strong>
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 8, width: "100%" }}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <button onClick={handleUpload} style={{ padding: "8px 12px" }}>
          Upload (watermarked)
        </button>

        {status ? (
          <div style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{status}</div>
        ) : null}

        {error ? (
          <div style={{ marginTop: 12, whiteSpace: "pre-wrap", color: "crimson" }}>{error}</div>
        ) : null}
      </div>
    </div>
  );
}


   
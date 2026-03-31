import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Redirect if already signed in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) navigate("/gallery");
    };

    checkSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/gallery");
    });

    return () => {
      sub?.subscription?.unsubscribe?.();
    };
  }, [navigate]);

  const handleClick = async () => {
    console.log("CLICK FIRED"); // MUST appear

    if (!email) {
      setMessage("Email is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    const redirectTo = `${window.location.origin}/gallery`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        console.error("OTP ERROR:", error);
        setMessage(error.message);
      } else {
        setMessage("Magic link sent. Check your email.");
      }
    } catch (err) {
      console.error("SIGN IN ERROR:", err);
      setMessage("Unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "60px auto",
        padding: 20,
        position: "relative",
        zIndex: 1,
      }}
    >
      <h2>Sign In</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          Email
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10 }}
          />
        </label>

        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          style={{
            padding: 12,
            cursor: loading ? "not-allowed" : "pointer",
            pointerEvents: loading ? "none" : "auto",
            opacity: loading ? 0.7 : 1,
            position: "relative",
            zIndex: 2,
          }}
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>

        {message && (
          <div style={{ fontSize: 14 }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}


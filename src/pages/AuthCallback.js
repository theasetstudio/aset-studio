// src/pages/AuthCallback.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function finish() {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (!mounted) return;

        if (error) {
          console.error("Auth callback error:", error);
          navigate("/gallery", { replace: true });
          return;
        }

        // ✅ If we saved a "returnTo" path before login, go there.
        // Otherwise, go to Gallery (never force /admin).
        let returnTo = "/gallery";
        try {
          const saved = sessionStorage.getItem("as_return_to");
          if (saved && typeof saved === "string") returnTo = saved;
          sessionStorage.removeItem("as_return_to");
        } catch {
          // ignore
        }

        navigate(returnTo, { replace: true });
      } catch (e) {
        console.error("Auth callback exception:", e);
        navigate("/gallery", { replace: true });
      }
    }

    finish();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return null;
}
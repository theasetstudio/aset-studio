import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const SHOW_GENERATOR_HOME = false;
const SHOW_GENERATOR_LAUNCH_TEXT = false;

const quickLinks = [
  {
    title: "Gallery",
    description: "Browse the public image experience and featured visual work.",
    to: "/gallery",
  },
  {
    title: "Creators",
    description: "Discover creators, profiles, portfolios, and connections.",
    to: "/creators",
  },
  {
    title: "Creator Hub",
    description: "Enter the creator side of the platform and manage your space.",
    to: "/creator-hub",
  },
  {
    title: "Favorites",
    description: "Open your saved items and revisit what you’ve collected.",
    to: "/favorites",
  },
  {
    title: "Messages",
    description: "Open creator and user messaging inside the platform.",
    to: "/messages",
  },
  {
    title: "Sirens Realm",
    description: "Explore stones, collections, and the Sirens Realm portal.",
    to: "/sirens-realm",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [authMode, setAuthMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setError(sessionError.message || "Unable to load session.");
        return;
      }

      setSession(data?.session || null);
    }

    async function loadFeaturedVideo() {
      const { data, error: videoError } = await supabase.storage
        .from("media")
        .createSignedUrl("videos/The_Aset_Studio_Welcome_0.MOV", 60 * 60);

      if (!mounted) return;

      if (videoError) {
        console.error("Featured video signed URL error:", videoError.message);
        return;
      }

      if (data?.signedUrl) {
        setVideoUrl(data.signedUrl);
      }
    }

    loadSession();
    loadFeaturedVideo();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession || null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  const resetAuthFields = () => {
    setEmail("");
    setPassword("");
    setSignupPassword("");
    setConfirmPassword("");
  };

  const switchMode = (mode) => {
    resetFeedback();
    setAuthMode(mode);
    setPassword("");
    setSignupPassword("");
    setConfirmPassword("");
  };

  const openSignInPanel = () => {
    resetFeedback();
    setAuthMode("signin");
    setAuthOpen((prev) => !prev);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    resetFeedback();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      setError("Enter both your email and password.");
      return;
    }

    setBusy(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) throw signInError;

      setMessage("You’re signed in.");
      setAuthOpen(false);
      resetAuthFields();
    } catch (err) {
      setError(err?.message || "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    resetFeedback();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !signupPassword.trim() || !confirmPassword.trim()) {
      setError("Complete all create-account fields.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: signupPassword,
      });

      if (signUpError) throw signUpError;

      setMessage("Account created. You can now sign in with your password.");
      setAuthMode("signin");
      setPassword("");
      setSignupPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err?.message || "Account creation failed.");
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    resetFeedback();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter your email address first.");
      return;
    }

    setBusy(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;

      setMessage("Password reset email sent.");
    } catch (err) {
      setError(err?.message || "Password reset failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    resetFeedback();
    setBusy(true);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setMessage("You’ve been signed out.");
      setAuthOpen(false);
    } catch (err) {
      setError(err?.message || "Sign out failed.");
    } finally {
      setBusy(false);
    }
  };

  const authIdentity =
    session?.user?.email ||
    session?.user?.phone ||
    session?.user?.user_metadata?.email ||
    session?.user?.user_metadata?.phone ||
    "";

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />

        <div style={styles.heroInner}>
          <div style={styles.brand}>THE ASET STUDIO</div>

          <h1 style={styles.headline}>
            A Creative Temple of Image, Sound &amp; Sovereignty.
          </h1>

          <p style={styles.subtext}>
            Egyptian royalty. Mythic cinema. A siren&apos;s whisper beneath the
            surface.
          </p>

          {SHOW_GENERATOR_LAUNCH_TEXT ? (
            <p style={styles.generatorLaunchText}>
              A new instrument has entered the temple. The Generator is now
              live.
            </p>
          ) : null}

          <div style={styles.heroActionStack}>
            {session ? (
              <div style={styles.loggedInWrap}>
                <div style={styles.loggedInText}>
                  Signed in{authIdentity ? ` as ${authIdentity}` : ""}
                </div>

                <div style={styles.loggedInButtons}>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={busy}
                    style={styles.secondaryButton}
                  >
                    {busy ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.guestWrap}>
                <div style={styles.guestButtons}>
                  <button
                    type="button"
                    onClick={openSignInPanel}
                    style={styles.primaryButton}
                  >
                    {authOpen ? "Close Sign In" : "Sign In / Enter"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/auth")}
                    style={styles.secondaryButton}
                  >
                    Open Full Auth Page
                  </button>
                </div>
              </div>
            )}
          </div>

          {!session && authOpen ? (
            <div style={styles.authPanel}>
              <div style={styles.authPanelTitle}>Enter the Temple</div>
              <div style={styles.authPanelText}>
                Sign in directly from the home page.
              </div>

              <div style={styles.modeTabs}>
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  style={{
                    ...styles.modeTab,
                    ...(authMode === "signin" ? styles.modeTabActive : {}),
                  }}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  style={{
                    ...styles.modeTab,
                    ...(authMode === "signup" ? styles.modeTabActive : {}),
                  }}
                >
                  Create Account
                </button>

                <button
                  type="button"
                  onClick={() => switchMode("reset")}
                  style={{
                    ...styles.modeTab,
                    ...(authMode === "reset" ? styles.modeTabActive : {}),
                  }}
                >
                  Reset Password
                </button>
              </div>

              {authMode === "signin" ? (
                <form onSubmit={handleSignIn} style={styles.authForm}>
                  <label style={styles.authLabel}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={styles.authInput}
                    disabled={busy}
                  />

                  <label style={styles.authLabel}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={styles.authInput}
                    disabled={busy}
                  />

                  <button
                    type="submit"
                    style={styles.authPrimaryBtn}
                    disabled={busy}
                  >
                    {busy ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              ) : null}

              {authMode === "signup" ? (
                <form onSubmit={handleSignUp} style={styles.authForm}>
                  <label style={styles.authLabel}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={styles.authInput}
                    disabled={busy}
                  />

                  <label style={styles.authLabel}>Password</label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    style={styles.authInput}
                    disabled={busy}
                  />

                  <label style={styles.authLabel}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    style={styles.authInput}
                    disabled={busy}
                  />

                  <button
                    type="submit"
                    style={styles.authPrimaryBtn}
                    disabled={busy}
                  >
                    {busy ? "Creating..." : "Create Account"}
                  </button>
                </form>
              ) : null}

              {authMode === "reset" ? (
                <form onSubmit={handlePasswordReset} style={styles.authForm}>
                  <label style={styles.authLabel}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={styles.authInput}
                    disabled={busy}
                  />

                  <button
                    type="submit"
                    style={styles.authPrimaryBtn}
                    disabled={busy}
                  >
                    {busy ? "Sending..." : "Send Reset Email"}
                  </button>
                </form>
              ) : null}

              {message ? <div style={styles.successText}>{message}</div> : null}
              {error ? <div style={styles.errorText}>{error}</div> : null}
            </div>
          ) : null}

          <div style={styles.ctaRow}>
            <Link to="/gallery" style={styles.primaryBtn}>
              Enter the Gallery
            </Link>

            {SHOW_GENERATOR_HOME ? (
              <Link to="/generator" style={styles.generatorBtn}>
                Enter the Generator
              </Link>
            ) : null}

            <Link to="/sirens-realm" style={styles.ghostBtn}>
              Enter Sirens Realm
            </Link>
          </div>

          <div style={styles.note}>
            Public access is open. Boudoir requires age verification.
          </div>
        </div>
      </section>

      <section style={styles.featureVideoSection}>
        <div style={styles.featureVideoInner}>
          <div style={styles.featureVideoEyebrow}>WHO IS THE ASET STUDIO</div>

          <h2 style={styles.featureVideoTitle}>
            Enter the world before you choose a portal.
          </h2>

          <p style={styles.featureVideoText}>
            A cinematic introduction to the vision, presence, and identity of
            The Aset Studio.
          </p>

          <div style={styles.videoFrame}>
            {videoUrl ? (
              <video controls playsInline preload="metadata" style={styles.video}>
                <source src={videoUrl} type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div style={styles.videoPlaceholder}>
                Featured video is loading...
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionTitle}>Explore the Platform</div>

        <div style={styles.quickLinkGrid}>
          {quickLinks.map((item) => (
            <Link key={item.to} to={item.to} style={styles.quickLinkCard}>
              <div style={styles.quickLinkTitle}>{item.title}</div>
              <div style={styles.quickLinkDesc}>{item.description}</div>
              <div style={styles.quickLinkAction}>Open →</div>
            </Link>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionTitle}>Access Levels</div>

        <div style={styles.tierGrid}>
          <div style={styles.tierCard}>
            <div style={styles.tierName}>Public</div>
            <div style={styles.tierDesc}>
              Witness the surface. Everyone can enter.
            </div>
          </div>

          <div style={styles.tierCard}>
            <div style={styles.tierName}>Boudoir</div>
            <div style={styles.tierDesc}>
              Restricted content. Age verification required.
            </div>
          </div>
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <div style={styles.sectionTitle}>Reviews &amp; Testimonies</div>

        <div style={styles.quoteGrid}>
          <blockquote style={styles.quote}>
            “Aset is not just a gallery — it’s an experience. Every image feels
            like a scene.”
          </blockquote>

          <blockquote style={styles.quote}>
            “Luxury, mystery, and craft. The work speaks like mythology.”
          </blockquote>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerText}>
          © {new Date().getFullYear()} The Aset Studio • Curated releases
          opening in waves.
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#07070a",
    color: "#f2f0ea",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  hero: {
    position: "relative",
    minHeight: "88vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(56px, 8vw, 96px) clamp(16px, 4vw, 28px)",
    backgroundImage: "url('/images/aset-hero.png')",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.44), rgba(0,0,0,0.56))",
    pointerEvents: "none",
  },
  heroInner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 980,
    width: "100%",
    textAlign: "center",
    paddingTop: "clamp(18px, 4vw, 40px)",
    paddingBottom: "clamp(18px, 4vw, 40px)",
  },
  brand: {
    letterSpacing: "0.22em",
    fontSize: "clamp(11px, 1.8vw, 12px)",
    opacity: 0.95,
    marginBottom: 10,
  },
  headline: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 600,
    fontSize: "clamp(32px, 6vw, 52px)",
    lineHeight: 1.08,
    margin: "0 0 14px",
    textWrap: "balance",
  },
  subtext: {
    maxWidth: 720,
    margin: "0 auto 22px",
    opacity: 0.9,
    fontSize: "clamp(15px, 2.6vw, 17px)",
    lineHeight: 1.6,
    paddingLeft: 4,
    paddingRight: 4,
  },
  generatorLaunchText: {
    maxWidth: 760,
    margin: "0 auto 22px",
    opacity: 0.9,
    fontSize: "clamp(14px, 2.4vw, 15px)",
    lineHeight: 1.6,
    color: "rgba(242,240,234,0.92)",
    paddingLeft: 4,
    paddingRight: 4,
  },
  heroActionStack: {
    width: "100%",
    maxWidth: 760,
    margin: "0 auto 22px",
  },
  guestWrap: {
    width: "100%",
  },
  guestButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    width: "100%",
  },
  loggedInWrap: {
    width: "100%",
  },
  loggedInText: {
    display: "inline-block",
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 1.5,
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.12)",
    maxWidth: "100%",
    overflowWrap: "anywhere",
  },
  loggedInButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid rgba(170,140,70,0.60)",
    background: "rgba(170,140,70,0.20)",
    color: "#f2f0ea",
    cursor: "pointer",
    fontWeight: 700,
    minWidth: 220,
    textDecoration: "none",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.05)",
    color: "#f2f0ea",
    cursor: "pointer",
    fontWeight: 600,
    minWidth: 220,
    textDecoration: "none",
  },
  authPanel: {
    width: "min(100%, 560px)",
    margin: "0 auto 24px",
    padding: 18,
    borderRadius: 20,
    background: "rgba(7,7,10,0.72)",
    border: "1px solid rgba(170,140,70,0.24)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
    textAlign: "left",
    backdropFilter: "blur(10px)",
  },
  authPanelTitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 22,
    marginBottom: 6,
  },
  authPanelText: {
    fontSize: 14,
    opacity: 0.82,
    lineHeight: 1.5,
    marginBottom: 16,
  },
  modeTabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  modeTab: {
    minHeight: 40,
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "#f2f0ea",
    cursor: "pointer",
    fontWeight: 700,
  },
  modeTabActive: {
    border: "1px solid rgba(170,140,70,0.62)",
    background: "rgba(170,140,70,0.20)",
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 14,
  },
  authLabel: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.01em",
  },
  authInput: {
    width: "100%",
    minHeight: 46,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "#f2f0ea",
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },
  authPrimaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    padding: "12px 16px",
    borderRadius: 14,
    border: "1px solid rgba(170,140,70,0.62)",
    background: "rgba(170,140,70,0.20)",
    color: "#f2f0ea",
    cursor: "pointer",
    fontWeight: 700,
  },
  successText: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 1.5,
    color: "#d7c28a",
  },
  errorText: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 1.5,
    color: "#ffb2b2",
  },
  ctaRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 14,
    width: "100%",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(170,140,70,0.20)",
    border: "1px solid rgba(170,140,70,0.60)",
    color: "#f2f0ea",
    padding: "14px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    letterSpacing: "0.01em",
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
    minHeight: 50,
    minWidth: 190,
    flex: "1 1 220px",
    maxWidth: 260,
  },
  generatorBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(120,120,255,0.12)",
    border: "1px solid rgba(255,255,255,0.22)",
    color: "#f2f0ea",
    padding: "14px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    letterSpacing: "0.01em",
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
    minHeight: 50,
    minWidth: 190,
    flex: "1 1 220px",
    maxWidth: 260,
  },
  ghostBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#f2f0ea",
    padding: "14px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 600,
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
    minHeight: 50,
    minWidth: 190,
    flex: "1 1 220px",
    maxWidth: 260,
  },
  note: {
    opacity: 0.78,
    fontSize: "clamp(12px, 2.2vw, 13px)",
    marginTop: 10,
    lineHeight: 1.5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  featureVideoSection: {
    width: "100%",
    padding: "clamp(34px, 6vw, 56px) clamp(16px, 4vw, 24px)",
    background:
      "linear-gradient(to bottom, rgba(8,8,12,0.98), rgba(12,12,18,0.98))",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  featureVideoInner: {
    maxWidth: 1100,
    margin: "0 auto",
    textAlign: "center",
  },
  featureVideoEyebrow: {
    letterSpacing: "0.18em",
    fontSize: "clamp(11px, 1.8vw, 12px)",
    opacity: 0.82,
    marginBottom: 10,
  },
  featureVideoTitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 600,
    fontSize: "clamp(26px, 4vw, 38px)",
    lineHeight: 1.12,
    margin: "0 0 12px",
  },
  featureVideoText: {
    maxWidth: 760,
    margin: "0 auto 24px",
    opacity: 0.86,
    fontSize: "clamp(14px, 2.3vw, 16px)",
    lineHeight: 1.6,
  },
  videoFrame: {
    width: "100%",
    maxWidth: 920,
    margin: "0 auto",
    borderRadius: 22,
    overflow: "hidden",
    background: "#000",
    border: "1px solid rgba(170,140,70,0.18)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.38)",
  },
  video: {
    display: "block",
    width: "100%",
    height: "auto",
    background: "#000",
  },
  videoPlaceholder: {
    width: "100%",
    minHeight: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    color: "rgba(242,240,234,0.78)",
    fontSize: 15,
    lineHeight: 1.5,
    background: "linear-gradient(to bottom, #050507, #111117)",
  },
  section: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "clamp(34px, 6vw, 44px) clamp(16px, 4vw, 24px)",
  },
  sectionAlt: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "clamp(34px, 6vw, 44px) clamp(16px, 4vw, 24px)",
    background: "rgba(255,255,255,0.02)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  sectionTitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "clamp(20px, 3vw, 22px)",
    marginBottom: 18,
    letterSpacing: "0.02em",
  },
  quickLinkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  quickLinkCard: {
    display: "block",
    textDecoration: "none",
    color: "#f2f0ea",
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(170,140,70,0.16)",
    transition: "transform 0.18s ease, border-color 0.18s ease",
    minHeight: 180,
  },
  quickLinkTitle: {
    fontWeight: 800,
    marginBottom: 8,
    letterSpacing: "0.01em",
    fontSize: 16,
  },
  quickLinkDesc: {
    opacity: 0.82,
    lineHeight: 1.5,
    minHeight: 72,
    fontSize: 14,
  },
  quickLinkAction: {
    marginTop: 14,
    color: "rgba(242,240,234,0.92)",
    fontWeight: 700,
    fontSize: 14,
  },
  tierGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  tierCard: {
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(170,140,70,0.14)",
    minHeight: 145,
  },
  tierName: {
    fontWeight: 800,
    marginBottom: 6,
    letterSpacing: "0.01em",
    fontSize: 16,
  },
  tierDesc: {
    opacity: 0.8,
    lineHeight: 1.5,
    fontSize: 14,
  },
  quoteGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 14,
  },
  quote: {
    margin: 0,
    padding: 16,
    borderRadius: 18,
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.08)",
    opacity: 0.9,
    lineHeight: 1.6,
    fontSize: "clamp(14px, 2.4vw, 15px)",
  },
  footer: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "28px 16px 44px",
    opacity: 0.7,
  },
  footerLine: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    marginBottom: 12,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 1.5,
  },
};

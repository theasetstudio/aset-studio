// src/utils/access.js
// Single source of truth for content gating.
// Access levels: public | supreme | boudoir
// Rules:
// - Admin overrides everything
// - Public: accessible to everyone
// - Supreme: requires logged-in + active supreme access
// - Boudoir: requires logged-in + age verification
// - Hidden: denied (unless admin)

export const ACCESS = Object.freeze({
  PUBLIC: "public",
  SUPREME: "supreme",
  BOUDOIR: "boudoir",
});

export const ROLES = Object.freeze({
  ADMIN: "admin",
  CREATOR: "creator",
  SUPREME: "supreme",
  USER: "user",
});

export function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

export function normalizeAccessLevel(level) {
  return String(level || ACCESS.PUBLIC).trim().toLowerCase();
}

export function isAdmin(profile) {
  return normalizeRole(profile?.role) === ROLES.ADMIN;
}

export function isCreator(profile) {
  return normalizeRole(profile?.role) === ROLES.CREATOR;
}

export function isLoggedIn(user) {
  return !!user?.id;
}

export function isAgeVerified(profile) {
  return profile?.is_age_verified === true;
}

/**
 * Supreme is ACTIVE if:
 * - profiles.role === 'supreme'
 *
 * If you later move Supreme to Stripe/webhooks + expiration,
 * update only THIS function.
 */
export function hasSupreme(profile) {
  return normalizeRole(profile?.role) === ROLES.SUPREME;
}

// ---------- core gate ----------
export function getAccessGate({ user, profile, mediaItem }) {
  const accessLevel = normalizeAccessLevel(mediaItem?.access_level);

  // Admin override
  if (isAdmin(profile)) {
    return { allowed: true, reason: "admin", accessLevel };
  }

  // Hidden safeguard
  if (mediaItem?.hidden === true) {
    return { allowed: false, reason: "hidden", accessLevel };
  }

  // Public
  if (accessLevel === ACCESS.PUBLIC) {
    return { allowed: true, reason: "public", accessLevel };
  }

  // Must be logged in for non-public
  if (!isLoggedIn(user)) {
    return {
      allowed: false,
      reason: "login_required",
      needsLogin: true,
      accessLevel,
    };
  }

  // Supreme
  if (accessLevel === ACCESS.SUPREME) {
    if (hasSupreme(profile)) {
      return { allowed: true, reason: "supreme", accessLevel };
    }

    return {
      allowed: false,
      reason: "supreme_required",
      needsSupreme: true,
      accessLevel,
    };
  }

  // Boudoir
  if (accessLevel === ACCESS.BOUDOIR) {
    if (isAgeVerified(profile)) {
      return { allowed: true, reason: "boudoir_age_verified", accessLevel };
    }

    return {
      allowed: false,
      reason: "age_verification_required",
      needsAgeVerification: true,
      accessLevel,
    };
  }

  // Unknown: deny by default
  return {
    allowed: false,
    reason: "unknown_access_level",
    accessLevel,
  };
}

export function canAccessMediaItem(args) {
  return getAccessGate(args)?.allowed === true;
}

export function getGateMessage(gate) {
  if (!gate || gate.allowed) return "";

  if (gate.reason === "hidden") return "This content is unavailable.";
  if (gate.needsLogin) return "Please sign in to view this item.";
  if (gate.needsSupreme) return "Supreme Access required to view this item.";
  if (gate.needsAgeVerification) return "Age verification required to view this content.";
  return "Locked content.";
}

// Back-compat alias
export function canViewMediaItem(args) {
  return canAccessMediaItem(args);
}

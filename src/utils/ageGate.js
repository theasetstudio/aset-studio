// src/utils/ageGate.js

const KEY = "aset_age_verified_v1";

export function getAgeVerified() {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function setAgeVerified(value) {
  try {
    localStorage.setItem(KEY, value ? "true" : "false");
  } catch {
    // ignore
  }
}
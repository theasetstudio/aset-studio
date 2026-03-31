// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// THE ASET STUDIO — Runtime Stability Guard (ignore harmless AbortError overlay)
window.addEventListener("unhandledrejection", (event) => {
  const reason = event?.reason;
  const name = reason?.name;
  const msg = String(reason?.message || reason || "").toLowerCase();

  if (name === "AbortError" || msg.includes("signal is aborted")) {
    event.preventDefault();
  }
});

// Render (no StrictMode for local stability)
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();


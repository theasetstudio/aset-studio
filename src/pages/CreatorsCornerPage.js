import React from "react";
import VoiceNotesPanel from "../components/VoiceNotesPanel";

export default function CreatorsCornerPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Creators Corner</h1>

      <p>
        Your private creator workspace. Manage ideas, uploads, and
        collaboration tools here.
      </p>

      <h2 style={{ marginTop: "40px" }}>Voice Notes</h2>

      <VoiceNotesPanel />
    </div>
  );
}
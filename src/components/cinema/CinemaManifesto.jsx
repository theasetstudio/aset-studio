import React from "react";
import { Link } from "react-router-dom";

export default function CinemaManifesto() {
  return (
    <>
      <section className="cinema-manifesto">
        <p>THE ASET CINEMA</p>

        <h2>
          Real stories meet new technology.
          <span>Every form of cinema has a place here.</span>
        </h2>

        <div className="cinema-manifesto-grid">
          <article>
            <span>01</span>
            <h3>Real Cinema</h3>
            <p>
              Independent films, short films, documentaries, live-action
              productions, and filmmaker showcases.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>AI Cinema</h3>
            <p>
              Virtual productions, AI-powered films, original worlds, and
              next-generation visual storytelling.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Real Voices</h3>
            <p>
              Interviews, performances, commentary, comedy, music, and
              conversations with creative professionals.
            </p>
          </article>
        </div>
      </section>

      <footer className="cinema-footer">
        <p>THE ASET STUDIO</p>
        <span>One Studio. Infinite Possibilities.</span>
        <Link to="/">Enter the Main Studio</Link>
      </footer>
    </>
  );
}

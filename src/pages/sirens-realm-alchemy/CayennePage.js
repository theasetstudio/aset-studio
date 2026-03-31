import React from 'react';
import { Link } from 'react-router-dom';
import cayenneImg from '../../assets/cayenne.png';

const cayenneThemes = [
  'Protection',
  'Block Jealousy',
  'Block Gossip',
  'Block Spiritual Attacks',
  'Block Negative Intentions',
  'Toxic Exes Stay Away',
  'Drama Stay Away',
  'Nosy People Stay Away',
  'Fast Movement',
  'Quick Answers',
  'Expose Lies',
  'Stop Manipulation',
];

export default function CayennePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #140909 0%, #1d0c0c 35%, #0f0a0a 100%)',
        color: '#f5e9e0',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '18px' }}>
          <Link
            to="/sirens-realm-alchemy/conjurin-in-the-kitchen"
            style={{
              color: '#d7b27a',
              textDecoration: 'none',
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            ← Back
          </Link>
        </div>

        <div
          style={{
            position: 'relative',
            border: '1px solid rgba(215, 178, 122, 0.25)',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.28)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 14px',
              borderRadius: '999px',
              background: 'rgba(178, 47, 47, 0.18)',
              border: '1px solid rgba(255, 120, 120, 0.20)',
              color: '#ffb3a7',
              fontSize: '0.78rem',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              marginBottom: '18px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            Conjurin in the Kitchen
          </div>

          <h1
            style={{
              margin: '0 0 12px 0',
              fontSize: 'clamp(2.3rem, 5vw, 4rem)',
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#ffe5d0',
              position: 'relative',
              zIndex: 2,
            }}
          >
            Cayenne
          </h1>

          <div
            style={{
              position: 'absolute',
              top: '150px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '420px',
              height: '220px',
              background:
                'radial-gradient(circle, rgba(255,80,0,0.28) 0%, rgba(255,80,0,0.12) 35%, rgba(255,80,0,0) 75%)',
              filter: 'blur(55px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <img
            src={cayenneImg}
            alt="Cayenne pepper"
            style={{
              width: '100%',
              maxWidth: '720px',
              height: '320px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto 24px',
              borderRadius: '20px',
              position: 'relative',
              zIndex: 2,
            }}
          />

          <p
            style={{
              maxWidth: '760px',
              margin: '0 auto 26px',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: '#ead8cc',
              position: 'relative',
              zIndex: 2,
              textAlign: 'left',
            }}
          >
            Cayenne carries hot, fast, protective energy. It is aligned with
            blocking harmful intentions, keeping intrusive people away, exposing
            lies, stopping manipulation, and moving answers quickly.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {cayenneThemes.map((theme) => (
              <div
                key={theme}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '18px',
                  padding: '18px 16px',
                  minHeight: '84px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: '0.98rem',
                  lineHeight: 1.5,
                  color: '#fff3ea',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.16)',
                }}
              >
                {theme}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import cayenneImg from '../../assets/cayenne.png';

export default function ConjurinInTheKitchenPage() {
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
        <div
          style={{
            border: '1px solid rgba(215, 178, 122, 0.25)',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.28)',
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
            }}
          >
            Sirens Realm Alchemy
          </div>

          <h1
            style={{
              margin: '0 0 12px 0',
              fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#ffe5d0',
            }}
          >
            Conjurin in the Kitchen
          </h1>

          <p
            style={{
              maxWidth: '760px',
              margin: 0,
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: '#ead8cc',
            }}
          >
            A fire-rooted section of Sirens Realm Alchemy centered on kitchen
            conjure, spiritual protection, fast movement, truth exposure, and
            keeping harmful energy away from your space.
          </p>

          <div style={{ marginTop: '40px' }}>
            <h2
              style={{
                fontSize: '1.6rem',
                marginBottom: '16px',
                letterSpacing: '0.04em',
                color: '#ffe5d0',
              }}
            >
              Ingredients
            </h2>

            <Link
              to="/sirens-realm-alchemy/conjurin-in-the-kitchen/cayenne"
              style={{
                display: 'block',
                textDecoration: 'none',
                background: 'rgba(139,30,30,0.12)',
                border: '1px solid rgba(255,120,120,0.25)',
                borderRadius: '18px',
                overflow: 'hidden',
                color: '#f5e9e0',
                maxWidth: '500px',
              }}
            >
              <img
                src={cayenneImg}
                alt="Cayenne"
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              <div style={{ padding: '20px' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ffb3a7',
                    marginBottom: '6px',
                  }}
                >
                  Ingredient
                </div>

                <div
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  Cayenne
                </div>

                <div
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: '#e8d8cf',
                  }}
                >
                  Protection, blocking jealousy, exposing lies, and driving
                  harmful energy away.
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
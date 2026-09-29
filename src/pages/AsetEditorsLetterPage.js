import React from "react";
import { Link } from "react-router-dom";

const COLORS = {
  black: "#050505",
  softBlack: "#111111",
  sapphire: "#042D70",
  sapphireBright: "#0A4AA3",
  cream: "#F4EFE6",
  creamDeep: "#E8DFD2",
  mutedCream: "#CFC5B7",
  ink: "#171717",
  mutedInk: "#625E58",
};

export default function AsetEditorsLetterPage() {
  return (
    <main style={styles.page}>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .aset-letter-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(360px, 0.88fr) minmax(560px, 1.12fr);
        }

        .aset-letter-left {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .aset-letter-right {
          min-height: 100vh;
        }

        .aset-letter-title {
          font-size: clamp(64px, 7.3vw, 138px);
        }

        .aset-letter-columns {
          column-count: 2;
          column-gap: 54px;
          column-rule: 1px solid rgba(5, 5, 5, 0.12);
        }

        .aset-letter-columns p {
          break-inside: avoid;
        }

        .aset-dropcap::first-letter {
          float: left;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 94px;
          line-height: 0.74;
          padding-right: 12px;
          padding-top: 13px;
          color: ${COLORS.sapphire};
          font-weight: 700;
        }

        .aset-object-lens {
          position: absolute;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          right: -35px;
          bottom: 105px;
          border: 16px solid #191919;
          background:
            radial-gradient(
              circle at 38% 34%,
              rgba(244,239,230,0.32) 0%,
              rgba(4,45,112,0.85) 13%,
              #08152c 28%,
              #020205 58%,
              #111 61%,
              #030303 72%
            );
          box-shadow:
            0 28px 65px rgba(0,0,0,0.55),
            inset 0 0 0 5px rgba(244,239,230,0.06);
          transform: rotate(-11deg);
        }

        .aset-object-notebook {
          position: absolute;
          width: 270px;
          height: 185px;
          left: 54px;
          bottom: 60px;
          background: ${COLORS.cream};
          transform: rotate(-5deg);
          box-shadow: 0 30px 60px rgba(0,0,0,0.38);
          padding: 26px 28px;
        }

        .aset-object-notebook::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(5,5,5,0.12);
        }

        .aset-object-pen {
          position: absolute;
          width: 230px;
          height: 7px;
          left: 155px;
          bottom: 102px;
          background: linear-gradient(
            90deg,
            #050505 0%,
            #252525 55%,
            #b7aa8f 86%,
            #050505 100%
          );
          transform: rotate(24deg);
          transform-origin: center;
          box-shadow: 0 8px 16px rgba(0,0,0,0.35);
          z-index: 4;
        }

        .aset-sapphire-fabric {
          position: absolute;
          width: 460px;
          height: 170px;
          left: -75px;
          bottom: -35px;
          border-radius: 50% 55% 0 0;
          background:
            linear-gradient(
              135deg,
              #020b1c 0%,
              ${COLORS.sapphire} 28%,
              #0a4d9c 47%,
              #021b45 68%,
              #010814 100%
            );
          transform: rotate(8deg);
          opacity: 0.96;
          filter: drop-shadow(0 -18px 30px rgba(0,0,0,0.38));
        }

        @media (max-width: 1080px) {
          .aset-letter-shell {
            grid-template-columns: 1fr;
          }

          .aset-letter-left {
            min-height: 860px;
          }

          .aset-letter-right {
            min-height: auto;
          }
        }

        @media (max-width: 720px) {
          .aset-letter-left {
            min-height: 720px;
          }

          .aset-letter-columns {
            column-count: 1;
            column-rule: none;
          }

          .aset-letter-title {
  font-size: clamp(58px, 6.25vw, 118px);
  max-width: 100%;
}

          .aset-object-notebook {
            left: 24px;
            width: 220px;
            height: 150px;
          }

          .aset-object-pen {
            left: 90px;
            width: 190px;
          }

          .aset-object-lens {
            width: 145px;
            height: 145px;
            right: -30px;
          }
        }
      `}</style>

      <div className="aset-letter-shell">
        {/* =====================================================
            LEFT EDITORIAL PANEL
        ===================================================== */}
        <section
          className="aset-letter-left"
          style={styles.leftPanel}
        >
          <div style={styles.leftGlow} />

          <div style={styles.leftContent}>
            <div style={styles.issueEyebrow}>
              <span>ASET</span>
              <span style={styles.eyebrowRule} />
              <span>ISSUE 001</span>
              <span style={styles.eyebrowRule} />
              <span>NOVEMBER 2026</span>
            </div>

            <p style={styles.letterLabel}>
              A LETTER FROM THE EDITOR
            </p>

            <h1
              className="aset-letter-title"
              style={styles.heroTitle}
            >
              WE
              <br />
              DIDN&apos;T
              <br />
              WAIT FOR
              <br />
              <span style={styles.permission}>
                PERMISSION.
              </span>
            </h1>

            <div style={styles.leftStatement}>
              <span style={styles.statementNumber}>
                001
              </span>

              <p style={styles.statementText}>
                THE PREMIERE ISSUE
                <br />
                BEGINS HERE.
              </p>
            </div>
          </div>

          {/* Editorial still-life treatment */}
          <div
            className="aset-sapphire-fabric"
            aria-hidden="true"
          />

          <div
            className="aset-object-notebook"
            aria-hidden="true"
          >
            <div style={styles.notebookBrand}>
              ASET
            </div>

            <div style={styles.notebookLine} />
            <div style={styles.notebookLine} />
            <div style={styles.notebookLineShort} />
          </div>

          <div
            className="aset-object-pen"
            aria-hidden="true"
          />

          <div
            className="aset-object-lens"
            aria-hidden="true"
          />

          <div style={styles.leftBottomMark}>
            THE ASET STUDIO
          </div>
        </section>

        {/* =====================================================
            RIGHT READING PAGE
        ===================================================== */}
        <article
          className="aset-letter-right"
          style={styles.rightPanel}
        >
          <nav style={styles.topNav}>
            <Link
              to="/aset"
              style={styles.backLink}
            >
              ← ASET
            </Link>

            <div style={styles.topNavCenter}>
              THE PREMIERE ISSUE
            </div>

            <Link
              to="/aset/issues/issue-001"
              style={styles.issueLink}
            >
              ISSUE 001
            </Link>
          </nav>

          <div style={styles.articleHeader}>
            <p style={styles.kicker}>
              FROM THE EDITOR
            </p>

            <h2 style={styles.articleTitle}>
              Why ASET Exists
            </h2>

            <p style={styles.articleDeck}>
              Before the stories, the covers, the
              interviews and the worlds we build, there
              had to be a reason to open the door.
            </p>

            <div style={styles.headerRule}>
              <span style={styles.headerRuleBlue} />
            </div>
          </div>

          <div
            className="aset-letter-columns"
            style={styles.letterBody}
          >
            <p className="aset-dropcap">
              There comes a point when an idea has to
              become something you can open, see, read,
              experience and share.
            </p>

            <p>
              <strong>ASET is that moment for us.</strong>
            </p>

            <p>
              The Aset Studio was never meant to be just
              one thing. We are building a creative
              ecosystem where entertainment, original
              storytelling, photography, culture, talent,
              technology and visual production can exist
              under the same roof. ASET Magazine is
              another door into that world.
            </p>

            <p>
              This first issue isn&apos;t about pretending
              we have everything figured out. It&apos;s
              about creating with what we have, continuing
              to build what we need, and refusing to
              believe that meaningful work has to wait
              until every resource is perfectly in place.
            </p>

            <p>
              Inside <em>The Premiere Issue</em>,
              we&apos;re exploring the things that are
              shaping our own journey through
              entertainment.
            </p>

            <p>
              We&apos;re taking readers inside{" "}
              <strong>Ain&apos;t Nobody Innocent</strong>,
              not simply as a story, but as an original
              entertainment property being developed
              piece by piece.
            </p>

            <p>
              We&apos;re opening{" "}
              <strong>ASET Spotlight</strong> to creatives
              whose work and stories deserve room to
              breathe.
            </p>

            <p>
              We&apos;re going{" "}
              <strong>Behind the Lens</strong> to examine
              visual storytelling and the choices that
              turn an image into something that
              communicates before a single word is
              spoken.
            </p>

            <p>
              And we&apos;re entering one of the biggest
              conversations happening in entertainment
              right now:{" "}
              <strong>artificial intelligence</strong>.
              Not from the tired position that technology
              must either save the industry or destroy it,
              but by asking a different question. How can
              new tools assist creators, help independent
              productions develop ideas, and potentially
              become part of a pathway toward larger human
              productions rather than simply replacing
              the people who make them?
            </p>
          </div>

          <blockquote style={styles.pullQuote}>
            <span style={styles.quoteMark}>
              “
            </span>

            <span>
              We&apos;re interested in what creators can
              do with it.
            </span>
          </blockquote>

          <div
            className="aset-letter-columns"
            style={styles.letterBody}
          >
            <p>
              That conversation matters to us because
              ASET isn&apos;t interested in technology
              for technology&apos;s sake.
            </p>

            <p>
              We&apos;re interested in actors. Writers.
              Filmmakers. Photographers. Musicians.
              Authors. Makeup artists. Hairstylists.
              Designers. Producers. Independent creators.
              Established professionals. And the person
              somewhere right now building something
              remarkable without an industry-sized budget
              behind them.
            </p>

            <p>
              <strong>ASET will grow with them.</strong>
            </p>

            <p>
              Some stories will celebrate. Some will
              question. Some will analyze. Some will
              introduce you to somebody you didn&apos;t
              know yesterday. And sometimes we&apos;ll
              take you directly inside our own creative
              process, including the parts that work, the
              parts that don&apos;t, and the parts
              we&apos;re still figuring out.
            </p>

            <p>
              This Premiere Issue is not the finished
              destination.
            </p>
          </div>

          <section style={styles.closing}>
            <p style={styles.firstPage}>
              IT&apos;S THE
              <br />
              <span>FIRST PAGE.</span>
            </p>

            <div style={styles.signatureBlock}>
              <div style={styles.signature}>
                Franchesca Analisa
              </div>

              <div style={styles.signatureRole}>
                Founder, The Aset Studio
                <br />
                Editor, ASET
              </div>
            </div>

            <p style={styles.welcome}>
              Welcome to <strong>ASET.</strong>
            </p>
          </section>

          <footer style={styles.footer}>
            <span>THE PREMIERE ISSUE</span>
            <span>ASET</span>
            <span>NOVEMBER 2026</span>
          </footer>
        </article>
      </div>
    </main>
  );
}

const styles = {
  page: {
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    background: COLORS.black,
    fontFamily:
      'Arial, Helvetica, sans-serif',
  },

  leftPanel: {
    background:
      "linear-gradient(145deg, #050505 0%, #090909 56%, #020711 100%)",
    color: COLORS.cream,
    padding: "48px clamp(30px, 4vw, 76px) 290px",
    isolation: "isolate",
  },

  leftGlow: {
    position: "absolute",
    width: "540px",
    height: "540px",
    left: "-260px",
    top: "170px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(4,45,112,0.42) 0%, rgba(4,45,112,0.10) 42%, transparent 70%)",
    zIndex: -1,
  },

  leftContent: {
    position: "relative",
    zIndex: 3,
  },

  issueEyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.2em",
    color: COLORS.mutedCream,
  },

  eyebrowRule: {
    width: "24px",
    height: "1px",
    background: COLORS.sapphireBright,
  },

  letterLabel: {
    margin: "70px 0 18px",
    fontSize: "11px",
    letterSpacing: "0.28em",
    fontWeight: 800,
    color: COLORS.creamDeep,
  },

  heroTitle: {
    margin: 0,
    fontFamily:
      'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    lineHeight: 0.78,
    letterSpacing: "-0.075em",
    color: COLORS.cream,
  },

  permission: {
  color: COLORS.sapphireBright,
  fontStyle: "italic",
  display: "inline-block",
  fontSize: "0.58em",
  letterSpacing: "-0.08em",
  whiteSpace: "nowrap",
},

  leftStatement: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "54px",
  },

  statementNumber: {
    fontFamily:
      'Georgia, "Times New Roman", serif',
    fontSize: "42px",
    color: COLORS.sapphireBright,
  },

  statementText: {
    margin: 0,
    fontSize: "11px",
    lineHeight: 1.6,
    letterSpacing: "0.18em",
    fontWeight: 800,
  },

  notebookBrand: {
    fontFamily:
      'Georgia, "Times New Roman", serif',
    color: COLORS.black,
    fontWeight: 700,
    fontSize: "20px",
    letterSpacing: "0.12em",
  },

  notebookLine: {
    height: "1px",
    background: "rgba(5,5,5,0.18)",
    marginTop: "24px",
    width: "78%",
  },

  notebookLineShort: {
    height: "1px",
    background: "rgba(5,5,5,0.18)",
    marginTop: "24px",
    width: "48%",
  },

  leftBottomMark: {
    position: "absolute",
    left: "54px",
    bottom: "20px",
    zIndex: 5,
    color: COLORS.cream,
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.26em",
  },

  rightPanel: {
    background: COLORS.cream,
    color: COLORS.ink,
    padding:
      "0 clamp(30px, 5.2vw, 94px) 34px",
  },

  topNav: {
    minHeight: "72px",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: "20px",
    borderBottom:
      "1px solid rgba(5,5,5,0.16)",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.18em",
  },

  backLink: {
    color: COLORS.ink,
    textDecoration: "none",
  },

  topNavCenter: {
    textAlign: "center",
    color: COLORS.mutedInk,
  },

  issueLink: {
    justifySelf: "end",
    color: COLORS.sapphire,
    textDecoration: "none",
  },

  articleHeader: {
    padding: "74px 0 48px",
  },

  kicker: {
    margin: "0 0 16px",
    color: COLORS.sapphire,
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "0.3em",
  },

  articleTitle: {
    margin: 0,
    fontFamily:
      'Georgia, "Times New Roman", serif',
    fontSize: "clamp(48px, 5vw, 82px)",
    lineHeight: 0.98,
    letterSpacing: "-0.045em",
    fontWeight: 500,
  },

  articleDeck: {
    maxWidth: "660px",
    margin: "25px 0 0",
    color: COLORS.mutedInk,
    fontFamily:
      'Georgia, "Times New Roman", serif',
    fontSize: "20px",
    lineHeight: 1.55,
    fontStyle: "italic",
  },

  headerRule: {
    width: "100%",
    height: "1px",
    marginTop: "42px",
    background: "rgba(5,5,5,0.14)",
    position: "relative",
  },

  headerRuleBlue: {
    position: "absolute",
    width: "94px",
    height: "4px",
    top: "-2px",
    left: 0,
    background: COLORS.sapphire,
  },

  letterBody: {
    fontFamily:
      'Georgia, "Times New Roman", serif',
    fontSize: "17px",
    lineHeight: 1.85,
  },

  pullQuote: {
    margin: "64px 0",
    padding: "34px 0 34px 34px",
    borderTop: `1px solid ${COLORS.sapphire}`,
    borderBottom: `1px solid ${COLORS.sapphire}`,
    borderLeft: `8px solid ${COLORS.sapphire}`,
    fontFamily:
      'Georgia, "Times New Roman", serif',
    fontSize: "clamp(31px, 3.1vw, 52px)",
    lineHeight: 1.06,
    letterSpacing: "-0.035em",
    fontWeight: 600,
    color: COLORS.black,
  },

  quoteMark: {
    color: COLORS.sapphire,
    marginRight: "8px",
  },

  closing: {
    marginTop: "72px",
    paddingTop: "54px",
    borderTop: "2px solid #050505",
  },

  firstPage: {
    margin: 0,
    fontFamily:
      'Georgia, "Times New Roman", serif',
    fontSize: "clamp(52px, 6vw, 98px)",
    lineHeight: 0.86,
    letterSpacing: "-0.065em",
    fontWeight: 700,
  },

  signatureBlock: {
    marginTop: "56px",
    paddingLeft: "22px",
    borderLeft: `5px solid ${COLORS.sapphire}`,
  },

  signature: {
    fontFamily:
      '"Brush Script MT", "Segoe Script", cursive',
    fontSize: "42px",
    lineHeight: 1,
    color: COLORS.sapphire,
  },

  signatureRole: {
    marginTop: "13px",
    fontSize: "11px",
    lineHeight: 1.7,
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  welcome: {
    margin: "54px 0 0",
    fontFamily:
      'Georgia, "Times New Roman", serif',
    fontSize: "24px",
    fontStyle: "italic",
  },

  footer: {
    marginTop: "80px",
    paddingTop: "18px",
    borderTop: "1px solid #050505",
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    flexWrap: "wrap",
    fontSize: "9px",
    fontWeight: 900,
    letterSpacing: "0.2em",
  },
};
import React from "react";
import { Link } from "react-router-dom";

/* ==========================================
   ASET BRAND
========================================== */

const COLORS = {
  sapphire: "#042D70",
  sapphireDeep: "#031F4D",
  cream: "#F4EFE6",
  creamSoft: "#EEE7DC",
  black: "#050505",
  softBlack: "#141414",
  muted: "#6E6A64",
  line: "rgba(5,5,5,0.16)",
  lightLine: "rgba(244,239,230,0.18)",
};

/* ==========================================
   LOCAL STORAGE
========================================== */

const ARTICLE_STORAGE_KEY =
  "aset_magazine_articles";

const ISSUE_STORAGE_KEY =
  "aset_magazine_issues";

/* ==========================================
   ISSUE 001 FALLBACK

   This protects the original Premiere Issue
   while allowing ASET Editorial Admin to
   override its public information.
========================================== */

const fallbackIssues = [
  {
    id: 1,
    number: "001",
    title: "The Premiere Issue",
    slug: "issue-001",
    date: "September 2026",

    description:
      "The first issue of ASET begins a new chapter in entertainment, culture, creativity, visual storytelling, and original editorial publishing from The Aset Studio.",

    image: "",

    status: "Published",
  },
];

/* ==========================================
   FALLBACK ARTICLES

   These preserve the original homepage if
   localStorage has not been initialized yet.
========================================== */

const fallbackArticles = [
  {
    id: "aset-begins-here",
    category: "Cover Story",
    title: "ASET Begins Here",

    excerpt:
      "A new editorial platform enters The Aset Studio ecosystem, created to spotlight entertainment, talent, culture, original stories, and the people shaping what comes next.",

    author: "ASET Editorial",
    image: "",
    slug: "aset-begins-here",
    issue: "Issue 001",
    status: "Published",
    featured: true,
    coverStory: true,
  },

  {
    id: "people-behind-the-culture",
    category: "Aset Spotlight",
    title:
      "The People Behind the Culture",

    excerpt:
      "ASET Spotlight expands into long-form editorial profiles and conversations with creatives, performers, and entertainment professionals.",

    author: "ASET Editorial",
    image: "",
    slug: "people-behind-the-culture",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "television-worth-talking-about",
    category: "Film + Television",
    title:
      "What Makes Television Worth Talking About?",

    excerpt:
      "Characters, performances, storytelling, and the moments that keep audiences watching.",

    author: "ASET Editorial",
    image: "",
    slug: "television-worth-talking-about",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "entertainment-beyond-the-screen",
    category: "Culture",
    title:
      "Entertainment Is More Than the Screen",

    excerpt:
      "How style, conversation, fandom, music, and visual culture become part of the story.",

    author: "ASET Editorial",
    image: "",
    slug: "entertainment-beyond-the-screen",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "the-editorial-image",
    category: "Beauty + Style",
    title: "The Editorial Image",

    excerpt:
      "Photography, beauty, fashion, and visual identity meet inside the world of ASET.",

    author: "ASET Editorial",
    image: "",
    slug: "the-editorial-image",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "featured-creative",
    category: "Aset Spotlight",
    title: "Featured Creative",

    excerpt:
      "Actor · Artist · Creator",

    author: "ASET Editorial",
    image: "",
    slug: "featured-creative",
    issue: "Unassigned",
    status: "Published",
    featured: true,
    coverStory: false,
  },

  {
    id: "industry-voice",
    category: "Aset Spotlight",
    title: "Industry Voice",

    excerpt:
      "Entertainment Professional",

    author: "ASET Editorial",
    image: "",
    slug: "industry-voice",
    issue: "Unassigned",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "rising-talent",
    category: "Aset Spotlight",
    title: "Rising Talent",

    excerpt:
      "Performer · Storyteller",

    author: "ASET Editorial",
    image: "",
    slug: "rising-talent",
    issue: "Unassigned",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "performances-we-remember",
    category: "Film + Television",
    title:
      "The Performances We Remember",

    excerpt:
      "A closer look at the performances and creative choices that remain part of the conversation.",

    author: "ASET Editorial",
    image: "",
    slug: "performances-we-remember",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "characters-that-take-over",
    category: "Commentary",
    title:
      "Characters That Take Over the Conversation",

    excerpt:
      "Sometimes one character becomes impossible for an audience to stop discussing.",

    author: "ASET Editorial",
    image: "",
    slug: "characters-that-take-over",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "inside-modern-entertainment",
    category: "Industry",
    title:
      "Inside Modern Entertainment",

    excerpt:
      "Exploring an entertainment landscape where stories move between screens, platforms, publications, and audiences.",

    author: "ASET Editorial",
    image: "",
    slug: "inside-modern-entertainment",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "culture-behind-the-camera",
    category: "Culture",
    title:
      "The Culture Behind the Camera",

    excerpt:
      "ASET explores the creative worlds surrounding entertainment, from fandom and style to conversations that move beyond the credits.",

    author: "ASET Editorial",
    image: "",
    slug: "culture-behind-the-camera",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "entertainment-becomes-conversation",
    category: "Culture",
    title:
      "When Entertainment Becomes Conversation",

    excerpt:
      "Entertainment can continue long after the credits through discussion, interpretation, fandom, and culture.",

    author: "ASET Editorial",
    image: "",
    slug: "entertainment-becomes-conversation",
    issue: "Unassigned",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "beauty-as-storytelling",
    category: "Beauty + Style",
    title: "Beauty as Storytelling",

    excerpt:
      "Beauty can establish character, atmosphere, visual identity, and editorial direction.",

    author: "ASET Editorial",
    image: "",
    slug: "beauty-as-storytelling",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "creating-editorial-look",
    category: "Beauty + Style",
    title:
      "Creating the Editorial Look",

    excerpt:
      "A strong editorial image begins long before the shutter is pressed.",

    author: "ASET Editorial",
    image: "",
    slug: "creating-editorial-look",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "aset-photography-room",
    category: "Photography",
    title:
      "Inside The Aset Studio Photography Room",

    excerpt:
      "Photography becomes another storytelling language inside The Aset Studio.",

    author: "ASET Editorial",
    image: "",
    slug: "aset-photography-room",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "building-original-worlds",
    category: "Aset Originals",
    title: "Building Original Worlds",

    excerpt:
      "A look inside the concepts, visual development, and entertainment properties being created by The Aset Studio.",

    author: "ASET Editorial",
    image: "",
    slug: "building-original-worlds",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },

  {
    id: "inside-the-world-of-ani",
    category: "ANI",
    title: "Inside the World of ANI",

    excerpt:
      "Characters, locations, visual development, production concepts, and exclusive editorial material from The Aset Studio's original entertainment property.",

    author: "ASET Editorial",
    image: "",
    slug: "inside-the-world-of-ani",
    issue: "Issue 001",
    status: "Published",
    featured: false,
    coverStory: false,
  },
];

/* ==========================================
   STORAGE HELPERS
========================================== */

function readLocalCollection(
  key
) {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      `ASET storage read error for ${key}:`,
      error
    );

    return [];
  }
}

/* ==========================================
   ISSUE HELPERS
========================================== */

function normalizeIssueNumber(
  value = ""
) {
  const match =
    String(value).match(
      /(\d+)/
    );

  return match
    ? match[1].padStart(
        3,
        "0"
      )
    : "";
}

function normalizeIssueSlug(
  value = ""
) {
  const raw =
    String(value)
      .trim()
      .toLowerCase();

  if (!raw) {
    return "";
  }

  if (
    /^issue-\d+$/.test(
      raw
    )
  ) {
    return raw;
  }

  const number =
    normalizeIssueNumber(
      raw
    );

  if (number) {
    return `issue-${number}`;
  }

  return raw
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

/* ==========================================
   ARTICLE NORMALIZER
========================================== */

function normalizeArticle(
  article
) {
  if (!article) {
    return null;
  }

  const category =
    article.category ||
    "ASET Editorial";

  return {
    ...article,

    category,

    author:
      article.author ||
      "ASET Editorial",

    excerpt:
      article.excerpt ||
      "",

    image:
      article.image ||
      "",

    status:
      article.status ||
      "Draft",

    featured:
      Boolean(
        article.featured
      ),

    coverStory:
      Boolean(
        article.coverStory
      ),
  };
}

/* ==========================================
   BUILD PUBLIC ISSUES
========================================== */

function buildPublicIssues() {
  const storedIssues =
    readLocalCollection(
      ISSUE_STORAGE_KEY
    );

  const issueMap =
    new Map();

  fallbackIssues.forEach(
    (issue) => {
      issueMap.set(
        issue.slug,
        {
          ...issue,
        }
      );
    }
  );

  storedIssues.forEach(
    (issue) => {
      const number =
        normalizeIssueNumber(
          issue.number ||
            issue.slug ||
            issue.title
        );

      const slug =
        issue.slug ||
        normalizeIssueSlug(
          number
        );

      const fallback =
        issueMap.get(slug);

      issueMap.set(
        slug,
        {
          ...(fallback || {}),

          ...issue,

          number:
            number ||
            fallback?.number ||
            "",

          slug,

          title:
            issue.title?.trim() ||
            fallback?.title ||
            `Issue ${number}`,

          description:
            issue.description?.trim() ||
            fallback?.description ||
            "",

          date:
            issue.date?.trim() ||
            fallback?.date ||
            "",

          image:
            issue.image?.trim() ||
            issue.coverImage?.trim() ||
            fallback?.image ||
            "",

          status:
            issue.status ||
            fallback?.status ||
            "Draft",
        }
      );
    }
  );

  return Array.from(
    issueMap.values()
  )
    .filter(
      (issue) =>
        issue.status ===
        "Published"
    )
    .sort(
      (a, b) =>
        Number(
          b.number || 0
        ) -
        Number(
          a.number || 0
        )
    );
}

/* ==========================================
   BUILD PUBLIC ARTICLES
========================================== */

function buildPublicArticles() {
  const storedArticles =
    readLocalCollection(
      ARTICLE_STORAGE_KEY
    );

  const articleMap =
    new Map();

  fallbackArticles.forEach(
    (article) => {
      articleMap.set(
        article.slug,
        normalizeArticle(
          article
        )
      );
    }
  );

  storedArticles.forEach(
    (article) => {
      const fallback =
        articleMap.get(
          article.slug
        );

      /*
       * Existing Admin records
       * override fallback records.
       */
      articleMap.set(
        article.slug,
        normalizeArticle({
          ...(fallback || {}),
          ...article,

          /*
           * Empty Admin fields should
           * not erase established
           * editorial copy or imagery.
           */
          title:
            article.title?.trim() ||
            fallback?.title ||
            "Untitled Story",

          excerpt:
            article.excerpt?.trim() ||
            fallback?.excerpt ||
            "",

          author:
            article.author?.trim() ||
            fallback?.author ||
            "ASET Editorial",

          image:
            article.image?.trim() ||
            fallback?.image ||
            "",
        })
      );
    }
  );

  return Array.from(
    articleMap.values()
  ).filter(
    (article) =>
      article.status ===
      "Published"
  );
}

/* ==========================================
   ISSUE MEMBERSHIP
========================================== */

function articleBelongsToIssue(
  article,
  issue
) {
  if (
    !article ||
    !issue
  ) {
    return false;
  }

  const assignment =
    String(
      article.issue || ""
    ).trim();

  if (
    !assignment ||
    assignment.toLowerCase() ===
      "unassigned"
  ) {
    return false;
  }

  const articleNumber =
    normalizeIssueNumber(
      assignment
    );

  const issueNumber =
    normalizeIssueNumber(
      issue.number
    );

  return Boolean(
    articleNumber &&
      issueNumber &&
      articleNumber ===
        issueNumber
  );
}

/* ==========================================
   CATEGORY HELPERS
========================================== */

function categoryMatches(
  article,
  categories
) {
  const value =
    String(
      article?.category ||
        ""
    )
      .trim()
      .toLowerCase();

  return categories.some(
    (category) =>
      value ===
      category.toLowerCase()
  );
}

function isSpotlight(
  article
) {
  return categoryMatches(
    article,
    [
      "Aset Spotlight",
    ]
  );
}

function isFilm(
  article
) {
  return categoryMatches(
    article,
    [
      "Film + Television",
      "Commentary",
      "Industry",
    ]
  );
}

function isCulture(
  article
) {
  return categoryMatches(
    article,
    [
      "Culture",
    ]
  );
}

function isStyle(
  article
) {
  return categoryMatches(
    article,
    [
      "Beauty + Style",
      "Photography",
    ]
  );
}

function isOriginal(
  article
) {
  return categoryMatches(
    article,
    [
      "Aset Originals",
    ]
  );
}

function isANI(
  article
) {
  return categoryMatches(
    article,
    [
      "ANI",
      "Ain't Nobody Innocent",
    ]
  );
}

/* ==========================================
   HOMEPAGE DATA
========================================== */

function buildHomepageData() {
  const issues =
    buildPublicIssues();

  const articles =
    buildPublicArticles();

  /*
   * Highest numbered Published
   * issue becomes Current Issue.
   */
  const currentIssue =
    issues[0] ||
    fallbackIssues[0];

  const currentIssueArticles =
    articles.filter(
      (article) =>
        articleBelongsToIssue(
          article,
          currentIssue
        )
    );

  /*
   * Admin Cover Story controls
   * the lead feature.
   */
  const leadStory =
    currentIssueArticles.find(
      (article) =>
        article.coverStory
    ) ||
    currentIssueArticles[0] ||
    articles.find(
      (article) =>
        article.coverStory
    ) ||
    fallbackArticles[0];

  /*
   * Latest excludes the lead.
   */
  const latestStories =
    currentIssueArticles
      .filter(
        (article) =>
          article.slug !==
          leadStory.slug
      )
      .slice(0, 4);

  /*
   * Section feeds.
   *
   * These can include published
   * articles outside the current
   * issue so the ASET homepage
   * remains a living publication.
   */
  const spotlightStories =
    articles
      .filter(
        isSpotlight
      )
      .slice(0, 3);

  const filmStories =
    articles
      .filter(
        isFilm
      )
      .slice(0, 3);

  const cultureStories =
    articles
      .filter(
        isCulture
      )
      .slice(0, 2);

  const styleStories =
    articles
      .filter(
        isStyle
      )
      .slice(0, 3);

  const originalStories =
    articles
      .filter(
        isOriginal
      )
      .slice(0, 1);

  const aniStories =
    articles
      .filter(
        isANI
      )
      .slice(0, 1);

  return {
    currentIssue,
    leadStory,
    latestStories,
    spotlightStories,
    filmStories,
    cultureStories,
    styleStories,
    originalStories,
    aniStories,
    pastIssues: issues,
  };
}

/* ==========================================
   IMAGE PLACEHOLDER
========================================== */

function ImagePlaceholder({
  label = "ASET",
  dark = false,
}) {
  return (
    <div
      style={{
        ...styles.imagePlaceholder,

        ...(dark
          ? styles.imagePlaceholderDark
          : {}),
      }}
    >
      <span
        style={{
          ...styles.imagePlaceholderText,

          ...(dark
            ? styles.imagePlaceholderTextDark
            : {}),
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ==========================================
   SECTION HEADING
========================================== */

function SectionHeading({
  eyebrow,
  title,
  number,
  dark = false,
  intro,
}) {
  return (
    <div
      className="aset-section-heading"
      style={{
        ...styles.sectionHeading,

        borderBottomColor:
          dark
            ? COLORS.lightLine
            : COLORS.line,
      }}
    >
      <div>
        <div
          style={{
            ...styles.eyebrow,

            color:
              dark
                ? COLORS.cream
                : COLORS.sapphire,
          }}
        >
          {eyebrow}
        </div>

        <h2
          style={{
            ...styles.sectionTitle,

            color:
              dark
                ? COLORS.cream
                : COLORS.black,
          }}
        >
          {title}
        </h2>

        {intro ? (
          <p
            style={{
              ...styles.sectionIntro,

              color:
                dark
                  ? "rgba(244,239,230,0.72)"
                  : COLORS.muted,
            }}
          >
            {intro}
          </p>
        ) : null}
      </div>

      <div
        className="aset-section-number"
        style={{
          ...styles.sectionNumber,

          color:
            dark
              ? "rgba(244,239,230,0.18)"
              : "rgba(5,5,5,0.16)",
        }}
      >
        {number}
      </div>
    </div>
  );
}

/* ==========================================
   STORY META
========================================== */

function StoryMeta({
  children,
  light = false,
}) {
  return (
    <div
      style={{
        ...styles.storyMeta,

        color:
          light
            ? COLORS.cream
            : COLORS.sapphire,
      }}
    >
      {children}
    </div>
  );
}
/* ==========================================
   ASET MAGAZINE PAGE
========================================== */

function AsetMagazinePage() {
  const {
    currentIssue,
    leadStory,
    latestStories,
    spotlightStories,
    filmStories,
    cultureStories,
    styleStories,
    originalStories,
    aniStories,
    pastIssues,
  } = buildHomepageData();

  const issueSlug =
    currentIssue?.slug ||
    `issue-${currentIssue?.number || "001"}`;

  return (
    <main style={styles.page}>
      <style>
        {`
          html {
            scroll-behavior: smooth;
          }

          * {
            box-sizing: border-box;
          }

          .aset-hover-link {
            transition:
              color 160ms ease,
              opacity 160ms ease,
              transform 160ms ease;
          }

          .aset-hover-link:hover {
            opacity: 0.72;
          }

          .aset-card {
            transition:
              transform 180ms ease,
              box-shadow 180ms ease;
          }

          .aset-card:hover {
            transform: translateY(-3px);
          }

          @media (max-width: 980px) {
            .aset-issue-hero,
            .aset-cover-story,
            .aset-culture-grid,
            .aset-original-grid,
            .aset-film-grid,
            .aset-latest-grid {
              grid-template-columns: 1fr !important;
            }

            .aset-latest-secondary {
              grid-template-columns:
                repeat(2, minmax(0, 1fr)) !important;
            }

            .aset-spotlight-grid,
            .aset-style-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr)) !important;
            }

            .aset-ani-inner {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 700px) {
            .aset-mag-nav {
              gap: 14px !important;
            }

            .aset-latest-secondary,
            .aset-spotlight-grid,
            .aset-style-grid,
            .aset-film-side-grid {
              grid-template-columns: 1fr !important;
            }

            .aset-section-heading {
              align-items: flex-start !important;
            }

            .aset-section-number {
              font-size: 28px !important;
            }

            .aset-mag-wrap {
              padding-left: 5% !important;
              padding-right: 5% !important;
            }

            .aset-footer-links {
              flex-direction: column;
              gap: 12px !important;
            }
          }
        `}
      </style>

      {/* =====================================
          MASTHEAD
      ===================================== */}

      <header style={styles.header}>
        <div
          className="aset-mag-wrap"
          style={styles.headerInner}
        >
          <div
            style={
              styles.publicationLine
            }
          >
            A PUBLICATION BY THE ASET
            STUDIO
          </div>

          <div
            style={
              styles.mastheadRule
            }
          />

          <h1 style={styles.logo}>
            ASET
          </h1>

          <div style={styles.tagline}>
            ENTERTAINMENT · CULTURE ·
            CREATIVITY
          </div>

          <nav
            className="aset-mag-nav"
            style={styles.nav}
          >
            <a
              href="#latest"
              className="aset-hover-link"
              style={styles.navLink}
            >
              LATEST
            </a>

            <a
              href="#spotlight"
              className="aset-hover-link"
              style={styles.navLink}
            >
              SPOTLIGHT
            </a>

            <a
              href="#film-tv"
              className="aset-hover-link"
              style={styles.navLink}
            >
              FILM + TV
            </a>

            <a
              href="#culture"
              className="aset-hover-link"
              style={styles.navLink}
            >
              CULTURE
            </a>

            <a
              href="#style"
              className="aset-hover-link"
              style={styles.navLink}
            >
              STYLE
            </a>

            <a
              href="#originals"
              className="aset-hover-link"
              style={styles.navLink}
            >
              ORIGINALS
            </a>

            <a
              href="#issues"
              className="aset-hover-link"
              style={styles.navLink}
            >
              ISSUES
            </a>
          </nav>
        </div>
      </header>

      {/* =====================================
          CURRENT ISSUE
      ===================================== */}

      <section
        style={styles.issueSection}
      >
        <div
          className="aset-issue-hero aset-mag-wrap"
          style={styles.issueHero}
        >
          <div
            style={
              styles.issueVisualColumn
            }
          >
            <div
              style={
                styles.issueLabel
              }
            >
              CURRENT ISSUE
            </div>

            <div
              style={
                styles.issueCoverFrame
              }
            >
              {currentIssue?.image ? (
                <img
                  src={
                    currentIssue.image
                  }
                  alt={`ASET Issue ${currentIssue.number}`}
                  style={
                    styles.fullImage
                  }
                />
              ) : (
                <div
                  style={
                    styles.coverPlaceholder
                  }
                >
                  <div
                    style={
                      styles.coverTop
                    }
                  >
                    ASET
                  </div>

                  <div
                    style={
                      styles.coverCenter
                    }
                  >
                    <span
                      style={
                        styles.coverIssueWord
                      }
                    >
                      ISSUE
                    </span>

                    <span
                      style={
                        styles.coverIssueNumber
                      }
                    >
                      {
                        currentIssue?.number
                      }
                    </span>
                  </div>

                  <div
                    style={
                      styles.coverBottom
                    }
                  >
                    {
                      currentIssue?.title
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={
              styles.issueContent
            }
          >
            <div
              style={
                styles.issueKicker
              }
            >
              NO.{" "}
              {currentIssue?.number}
              {currentIssue?.date
                ? ` · ${currentIssue.date.toUpperCase()}`
                : ""}
            </div>

            <h2
              style={
                styles.issueTitle
              }
            >
              {currentIssue?.title}
            </h2>

            {currentIssue?.description ? (
              <p
                style={
                  styles.issueDescription
                }
              >
                {
                  currentIssue.description
                }
              </p>
            ) : null}

            <div
              style={
                styles.issueDivider
              }
            />

            <div
              style={
                styles.buttonRow
              }
            >
              <Link
                to={`/aset/issues/${issueSlug}`}
                style={
                  styles.primaryButton
                }
              >
                READ THE ISSUE
              </Link>

              {leadStory?.slug ? (
                <Link
                  to={`/aset/articles/${leadStory.slug}`}
                  style={
                    styles.outlineButton
                  }
                >
                  COVER STORY
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          COVER STORY
      ===================================== */}

      {leadStory ? (
        <section
          style={
            styles.coverStorySection
          }
        >
          <div
            className="aset-cover-story"
            style={
              styles.coverStoryGrid
            }
          >
            <div
              style={
                styles.coverStoryImage
              }
            >
              {leadStory.image ? (
                <img
                  src={leadStory.image}
                  alt={leadStory.title}
                  style={
                    styles.fullImage
                  }
                />
              ) : (
                <ImagePlaceholder
                  label="ASET COVER STORY"
                />
              )}
            </div>

            <div
              style={
                styles.coverStoryContent
              }
            >
              <StoryMeta>
                {leadStory.category}
              </StoryMeta>

              <h2
                style={
                  styles.coverStoryTitle
                }
              >
                {leadStory.title}
              </h2>

              {leadStory.excerpt ? (
                <p
                  style={
                    styles.coverStoryExcerpt
                  }
                >
                  {leadStory.excerpt}
                </p>
              ) : null}

              <div
                style={
                  styles.coverStoryByline
                }
              >
                BY{" "}
                {(
                  leadStory.author ||
                  "ASET Editorial"
                ).toUpperCase()}
              </div>

              <Link
                to={`/aset/articles/${leadStory.slug}`}
                className="aset-hover-link"
                style={styles.textLink}
              >
                READ STORY →
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* =====================================
          LATEST STORIES
      ===================================== */}

      <section
        id="latest"
        style={styles.creamSection}
      >
        <div
          className="aset-mag-wrap"
          style={styles.sectionInner}
        >
          <SectionHeading
            eyebrow="THE FRONT PAGE"
            title="Latest Stories"
            number="01"
          />

          {latestStories.length >
          0 ? (
            <div
              className="aset-latest-grid"
              style={
                styles.latestGrid
              }
            >
              <article
                style={
                  styles.latestLead
                }
              >
                <div
                  style={
                    styles.latestLeadImage
                  }
                >
                  {latestStories[0]
                    ?.image ? (
                    <img
                      src={
                        latestStories[0]
                          .image
                      }
                      alt={
                        latestStories[0]
                          .title
                      }
                      style={
                        styles.fullImage
                      }
                    />
                  ) : (
                    <ImagePlaceholder
                      label="FEATURE"
                    />
                  )}
                </div>

                <StoryMeta>
                  {
                    latestStories[0]
                      ?.category
                  }
                </StoryMeta>

                <h3
                  style={
                    styles.latestLeadTitle
                  }
                >
                  {
                    latestStories[0]
                      ?.title
                  }
                </h3>

                {latestStories[0]
                  ?.excerpt ? (
                  <p
                    style={
                      styles.storyExcerpt
                    }
                  >
                    {
                      latestStories[0]
                        .excerpt
                    }
                  </p>
                ) : null}

                <Link
                  to={`/aset/articles/${latestStories[0].slug}`}
                  className="aset-hover-link"
                  style={
                    styles.textLink
                  }
                >
                  READ FEATURE →
                </Link>
              </article>

              <div
                className="aset-latest-secondary"
                style={
                  styles.latestSecondaryGrid
                }
              >
                {latestStories
                  .slice(1)
                  .map(
                    (story) => (
                      <article
                        key={
                          story.id ||
                          story.slug
                        }
                        className="aset-card"
                        style={
                          styles.compactStoryCard
                        }
                      >
                        <div
                          style={
                            styles.compactStoryImage
                          }
                        >
                          {story.image ? (
                            <img
                              src={
                                story.image
                              }
                              alt={
                                story.title
                              }
                              style={
                                styles.fullImage
                              }
                            />
                          ) : (
                            <ImagePlaceholder />
                          )}
                        </div>

                        <StoryMeta>
                          {
                            story.category
                          }
                        </StoryMeta>

                        <h3
                          style={
                            styles.compactStoryTitle
                          }
                        >
                          {story.title}
                        </h3>

                        <Link
                          to={`/aset/articles/${story.slug}`}
                          className="aset-hover-link"
                          style={
                            styles.textLinkSmall
                          }
                        >
                          READ MORE →
                        </Link>
                      </article>
                    )
                  )}
              </div>
            </div>
          ) : (
            <p
              style={
                styles.storyExcerpt
              }
            >
              New stories will appear
              here as they are
              published.
            </p>
          )}
        </div>
      </section>

      {/* =====================================
          ASET SPOTLIGHT
      ===================================== */}

      <section
        id="spotlight"
        style={styles.blackSection}
      >
        <div
          className="aset-mag-wrap"
          style={styles.sectionInner}
        >
          <SectionHeading
            eyebrow="PEOPLE · TALENT · CREATORS"
            title="Aset Spotlight"
            number="02"
            dark
            intro="The people shaping entertainment and creativity take center stage."
          />

          {spotlightStories.length >
          0 ? (
            <div
              className="aset-spotlight-grid"
              style={
                styles.spotlightGrid
              }
            >
              {spotlightStories.map(
                (person) => (
                  <article
                    key={
                      person.id ||
                      person.slug
                    }
                    className="aset-card"
                    style={
                      styles.spotlightCard
                    }
                  >
                    <div
                      style={
                        styles.spotlightImage
                      }
                    >
                      {person.image ? (
                        <img
                          src={
                            person.image
                          }
                          alt={
                            person.title
                          }
                          style={
                            styles.fullImage
                          }
                        />
                      ) : (
                        <ImagePlaceholder
                          label="SPOTLIGHT"
                          dark
                        />
                      )}
                    </div>

                    <div
                      style={
                        styles.spotlightCopy
                      }
                    >
                      <h3
                        style={
                          styles.spotlightName
                        }
                      >
                        {person.title}
                      </h3>

                      <p
                        style={
                          styles.spotlightRole
                        }
                      >
                        {person.excerpt ||
                          person.category}
                      </p>

                      <Link
                        to={`/aset/articles/${person.slug}`}
                        className="aset-hover-link"
                        style={
                          styles.spotlightReadLink
                        }
                      >
                        READ PROFILE →
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <p
              style={{
                ...styles.storyExcerpt,
                color:
                  "rgba(244,239,230,0.65)",
              }}
            >
              New Spotlight features
              will appear here as they
              are published.
            </p>
          )}

          <div
            style={
              styles.sectionAction
            }
          >
            <Link
              to="/aset-spotlight"
              style={
                styles.creamButton
              }
            >
              VISIT ASET SPOTLIGHT
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================
          FILM + TELEVISION
      ===================================== */}

      <section
        id="film-tv"
        style={styles.creamSection}
      >
        <div
          className="aset-mag-wrap"
          style={styles.sectionInner}
        >
          <SectionHeading
            eyebrow="SCREEN"
            title="Film + Television"
            number="03"
          />

          {filmStories.length >
          0 ? (
            <div
              className="aset-film-grid"
              style={styles.filmGrid}
            >
              <article
                style={
                  styles.filmLead
                }
              >
                <div
                  style={
                    styles.filmLeadImage
                  }
                >
                  {filmStories[0]
                    ?.image ? (
                    <img
                      src={
                        filmStories[0]
                          .image
                      }
                      alt={
                        filmStories[0]
                          .title
                      }
                      style={
                        styles.fullImage
                      }
                    />
                  ) : (
                    <ImagePlaceholder
                      label="FILM + TV"
                    />
                  )}
                </div>

                <StoryMeta>
                  {
                    filmStories[0]
                      ?.category
                  }
                </StoryMeta>

                <h3
                  style={
                    styles.filmLeadTitle
                  }
                >
                  {
                    filmStories[0]
                      ?.title
                  }
                </h3>

                <Link
                  to={`/aset/articles/${filmStories[0].slug}`}
                  className="aset-hover-link"
                  style={
                    styles.textLink
                  }
                >
                  READ STORY →
                </Link>
              </article>

              <div
                className="aset-film-side-grid"
                style={
                  styles.filmSideGrid
                }
              >
                {filmStories
                  .slice(1)
                  .map(
                    (story) => (
                      <article
                        key={
                          story.id ||
                          story.slug
                        }
                        className="aset-card"
                        style={
                          styles.filmSideCard
                        }
                      >
                        <div
                          style={
                            styles.filmSideImage
                          }
                        >
                          {story.image ? (
                            <img
                              src={
                                story.image
                              }
                              alt={
                                story.title
                              }
                              style={
                                styles.fullImage
                              }
                            />
                          ) : (
                            <ImagePlaceholder
                              label="SCREEN"
                            />
                          )}
                        </div>

                        <div>
                          <StoryMeta>
                            {
                              story.category
                            }
                          </StoryMeta>

                          <h3
                            style={
                              styles.filmSideTitle
                            }
                          >
                            {
                              story.title
                            }
                          </h3>

                          <Link
                            to={`/aset/articles/${story.slug}`}
                            className="aset-hover-link"
                            style={
                              styles.textLinkSmall
                            }
                          >
                            READ STORY →
                          </Link>
                        </div>
                      </article>
                    )
                  )}
              </div>
            </div>
          ) : (
            <p
              style={
                styles.storyExcerpt
              }
            >
              Film and television
              stories will appear here
              as they are published.
            </p>
          )}
        </div>
      </section>
            {/* =====================================
          CULTURE
      ===================================== */}

      <section
        id="culture"
        style={styles.cultureSection}
      >
        <div
          className="aset-mag-wrap"
          style={styles.sectionInner}
        >
          <SectionHeading
            eyebrow="BEYOND THE SCREEN"
            title="Culture"
            number="04"
          />

          {cultureStories.length > 0 ? (
            <div
              className="aset-culture-grid"
              style={styles.cultureGrid}
            >
              <article
                style={styles.cultureLead}
              >
                <div
                  style={
                    styles.cultureLeadImage
                  }
                >
                  {cultureStories[0]
                    ?.image ? (
                    <img
                      src={
                        cultureStories[0]
                          .image
                      }
                      alt={
                        cultureStories[0]
                          .title
                      }
                      style={
                        styles.fullImage
                      }
                    />
                  ) : (
                    <ImagePlaceholder
                      label="CULTURE"
                    />
                  )}
                </div>

                <div
                  style={
                    styles.cultureLeadCopy
                  }
                >
                  <StoryMeta>
                    {
                      cultureStories[0]
                        ?.category
                    }
                  </StoryMeta>

                  <h3
                    style={
                      styles.cultureLeadTitle
                    }
                  >
                    {
                      cultureStories[0]
                        ?.title
                    }
                  </h3>

                  {cultureStories[0]
                    ?.excerpt ? (
                    <p
                      style={
                        styles.storyExcerpt
                      }
                    >
                      {
                        cultureStories[0]
                          .excerpt
                      }
                    </p>
                  ) : null}

                  <Link
                    to={`/aset/articles/${cultureStories[0].slug}`}
                    className="aset-hover-link"
                    style={
                      styles.textLink
                    }
                  >
                    READ STORY →
                  </Link>
                </div>
              </article>

              {cultureStories[1] ? (
                <article
                  className="aset-card"
                  style={
                    styles.cultureSecondary
                  }
                >
                  <div
                    style={
                      styles.cultureSecondaryNumber
                    }
                  >
                    02
                  </div>

                  <StoryMeta>
                    {
                      cultureStories[1]
                        .category
                    }
                  </StoryMeta>

                  <h3
                    style={
                      styles.cultureSecondaryTitle
                    }
                  >
                    {
                      cultureStories[1]
                        .title
                    }
                  </h3>

                  {cultureStories[1]
                    .excerpt ? (
                    <p
                      style={
                        styles.storyExcerpt
                      }
                    >
                      {
                        cultureStories[1]
                          .excerpt
                      }
                    </p>
                  ) : null}

                  <Link
                    to={`/aset/articles/${cultureStories[1].slug}`}
                    className="aset-hover-link"
                    style={
                      styles.textLink
                    }
                  >
                    READ STORY →
                  </Link>
                </article>
              ) : null}
            </div>
          ) : (
            <p
              style={
                styles.storyExcerpt
              }
            >
              Culture stories will
              appear here as they are
              published.
            </p>
          )}
        </div>
      </section>

      {/* =====================================
          BEAUTY + STYLE
      ===================================== */}

      <section
        id="style"
        style={styles.styleSection}
      >
        <div
          className="aset-mag-wrap"
          style={styles.sectionInner}
        >
          <SectionHeading
            eyebrow="THE IMAGE"
            title="Beauty + Style"
            number="05"
            dark
            intro="Beauty, fashion, photography, and visual identity as part of the story."
          />

          {styleStories.length > 0 ? (
            <div
              className="aset-style-grid"
              style={styles.styleGrid}
            >
              {styleStories.map(
                (story) => (
                  <article
                    key={
                      story.id ||
                      story.slug
                    }
                    className="aset-card"
                    style={
                      styles.styleCard
                    }
                  >
                    <div
                      style={
                        styles.styleImage
                      }
                    >
                      {story.image ? (
                        <img
                          src={
                            story.image
                          }
                          alt={
                            story.title
                          }
                          style={
                            styles.fullImage
                          }
                        />
                      ) : (
                        <ImagePlaceholder
                          label={
                            story.category
                          }
                          dark
                        />
                      )}
                    </div>

                    <StoryMeta light>
                      {story.category}
                    </StoryMeta>

                    <h3
                      style={
                        styles.styleTitle
                      }
                    >
                      {story.title}
                    </h3>

                    {story.excerpt ? (
                      <p
                        style={
                          styles.styleExcerpt
                        }
                      >
                        {story.excerpt}
                      </p>
                    ) : null}

                    <Link
                      to={`/aset/articles/${story.slug}`}
                      className="aset-hover-link"
                      style={
                        styles.styleReadLink
                      }
                    >
                      READ STORY →
                    </Link>
                  </article>
                )
              )}
            </div>
          ) : (
            <p
              style={{
                ...styles.storyExcerpt,
                color:
                  "rgba(244,239,230,0.72)",
              }}
            >
              Beauty, style, and
              photography stories will
              appear here as they are
              published.
            </p>
          )}
        </div>
      </section>

      {/* =====================================
          ASET ORIGINALS
      ===================================== */}

      <section
        id="originals"
        style={styles.originalsSection}
      >
        <div
          className="aset-mag-wrap"
          style={styles.sectionInner}
        >
          <SectionHeading
            eyebrow="FROM THE ASET STUDIO"
            title="ASET Originals"
            number="06"
            intro="Original worlds, productions, concepts, and creative properties developed inside The Aset Studio."
          />

          {originalStories.length >
          0 ? (
            <div
              className="aset-original-grid"
              style={
                styles.originalGrid
              }
            >
              <div
                style={
                  styles.originalImage
                }
              >
                {originalStories[0]
                  .image ? (
                  <img
                    src={
                      originalStories[0]
                        .image
                    }
                    alt={
                      originalStories[0]
                        .title
                    }
                    style={
                      styles.fullImage
                    }
                  />
                ) : (
                  <ImagePlaceholder
                    label="ASET ORIGINAL"
                  />
                )}
              </div>

              <article
                style={
                  styles.originalContent
                }
              >
                <StoryMeta>
                  {
                    originalStories[0]
                      .category
                  }
                </StoryMeta>

                <h3
                  style={
                    styles.originalTitle
                  }
                >
                  {
                    originalStories[0]
                      .title
                  }
                </h3>

                {originalStories[0]
                  .excerpt ? (
                  <p
                    style={
                      styles.originalExcerpt
                    }
                  >
                    {
                      originalStories[0]
                        .excerpt
                    }
                  </p>
                ) : null}

                <Link
                  to={`/aset/articles/${originalStories[0].slug}`}
                  className="aset-hover-link"
                  style={
                    styles.primaryButton
                  }
                >
                  EXPLORE THE STORY
                </Link>
              </article>
            </div>
          ) : (
            <p
              style={
                styles.storyExcerpt
              }
            >
              Original ASET Studio
              features will appear here
              as they are published.
            </p>
          )}
        </div>
      </section>

      {/* =====================================
          AIN'T NOBODY INNOCENT
      ===================================== */}

      {aniStories.length > 0 ? (
        <section
          style={styles.aniSection}
        >
          <div
            className="aset-ani-inner aset-mag-wrap"
            style={styles.aniInner}
          >
            <div
              style={styles.aniBrand}
            >
              <div
                style={
                  styles.aniKicker
                }
              >
                ASET ORIGINAL SERIES
              </div>

              <div
                style={styles.aniLogo}
              >
                AIN'T
                <br />
                NOBODY
                <br />
                INNOCENT
              </div>

              <div
                style={
                  styles.aniMark
                }
              >
                ANI
              </div>
            </div>

            <article
              style={
                styles.aniFeature
              }
            >
              <StoryMeta light>
                EXCLUSIVE EDITORIAL
              </StoryMeta>

              <h2
                style={
                  styles.aniFeatureTitle
                }
              >
                {aniStories[0].title}
              </h2>

              {aniStories[0]
                .excerpt ? (
                <p
                  style={
                    styles.aniFeatureExcerpt
                  }
                >
                  {
                    aniStories[0]
                      .excerpt
                  }
                </p>
              ) : null}

              <Link
                to={`/aset/articles/${aniStories[0].slug}`}
                className="aset-hover-link"
                style={
                  styles.aniButton
                }
              >
                ENTER THE WORLD OF ANI
              </Link>
            </article>
          </div>
        </section>
      ) : null}

      {/* =====================================
          FROM THE EDITOR
      ===================================== */}

      <section
        style={styles.editorSection}
      >
        <div
          className="aset-mag-wrap"
          style={styles.editorInner}
        >
          <div
            style={
              styles.editorEyebrow
            }
          >
            FROM THE EDITOR
          </div>

          <div
            style={
              styles.editorRule
            }
          />

          <blockquote
            style={
              styles.editorQuote
            }
          >
            “ASET is a place for
            stories, talent,
            entertainment, culture,
            creativity, and original
            ideas to live together.”
          </blockquote>

          <div
            style={
              styles.editorSignature
            }
          >
            ASET EDITORIAL
          </div>
        </div>
      </section>

      {/* =====================================
          ISSUES
      ===================================== */}

      <section
        id="issues"
        style={styles.issuesSection}
      >
        <div
          className="aset-mag-wrap"
          style={styles.sectionInner}
        >
          <SectionHeading
            eyebrow="THE NEWSSTAND"
            title="Issues"
            number="07"
            intro="Explore published editions of ASET."
          />

          {pastIssues.length > 0 ? (
            <div
              style={
                styles.issueArchiveGrid
              }
            >
              {pastIssues.map(
                (issue) => (
                  <article
                    key={
                      issue.id ||
                      issue.slug
                    }
                    className="aset-card"
                    style={
                      styles.archiveCard
                    }
                  >
                    <Link
                      to={`/aset/issues/${issue.slug}`}
                      className="aset-hover-link"
                      style={
                        styles.archiveCoverLink
                      }
                    >
                      <div
                        style={
                          styles.archiveCover
                        }
                      >
                        {issue.image ? (
                          <img
                            src={
                              issue.image
                            }
                            alt={`ASET ${issue.title}`}
                            style={
                              styles.fullImage
                            }
                          />
                        ) : (
                          <div
                            style={
                              styles.archiveCoverPlaceholder
                            }
                          >
                            <div
                              style={
                                styles.archiveLogo
                              }
                            >
                              ASET
                            </div>

                            <div
                              style={
                                styles.archiveIssueNumber
                              }
                            >
                              {
                                issue.number
                              }
                            </div>

                            <div
                              style={
                                styles.archiveCoverTitle
                              }
                            >
                              {
                                issue.title
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div
                      style={
                        styles.archiveMeta
                      }
                    >
                      <div
                        style={
                          styles.archiveNumber
                        }
                      >
                        ISSUE{" "}
                        {issue.number}
                      </div>

                      <h3
                        style={
                          styles.archiveTitle
                        }
                      >
                        {issue.title}
                      </h3>

                      {issue.date ? (
                        <div
                          style={
                            styles.archiveDate
                          }
                        >
                          {issue.date}
                        </div>
                      ) : null}

                      <Link
                        to={`/aset/issues/${issue.slug}`}
                        className="aset-hover-link"
                        style={
                          styles.textLinkSmall
                        }
                      >
                        OPEN ISSUE →
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <p
              style={
                styles.storyExcerpt
              }
            >
              Published issues will
              appear here.
            </p>
          )}
        </div>
      </section>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer style={styles.footer}>
        <div
          className="aset-mag-wrap"
          style={styles.footerInner}
        >
          <div
            style={styles.footerLogo}
          >
            ASET
          </div>

          <div
            style={
              styles.footerBlueRule
            }
          />

          <div
            style={
              styles.footerTagline
            }
          >
            ENTERTAINMENT · CULTURE ·
            CREATIVITY
          </div>

          <p
            style={
              styles.footerPublication
            }
          >
            A publication by The Aset
            Studio.
          </p>

          <div
            className="aset-footer-links"
            style={
              styles.footerLinks
            }
          >
            <Link
              to="/"
              className="aset-hover-link"
              style={
                styles.footerLink
              }
            >
              THE ASET STUDIO
            </Link>

            <Link
              to="/aset"
              className="aset-hover-link"
              style={
                styles.footerLink
              }
            >
              ASET MAGAZINE
            </Link>

            <Link
              to="/aset-spotlight"
              className="aset-hover-link"
              style={
                styles.footerLink
              }
            >
              ASET SPOTLIGHT
            </Link>

            <Link
              to="/videos"
              className="aset-hover-link"
              style={
                styles.footerLink
              }
            >
              ASET CINEMA
            </Link>
          </div>

          <div
            style={
              styles.copyright
            }
          >
            © 2026 THE ASET STUDIO
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ==========================================
   STYLES
========================================== */

const styles = {
  page: {
    minHeight: "100vh",
    margin: 0,
    background: COLORS.cream,
    color: COLORS.black,
    fontFamily:
      '"Helvetica Neue", Arial, sans-serif',
  },

  /* ========================================
     HEADER
  ======================================== */

  header: {
    background: COLORS.cream,
    borderBottom:
      `1px solid ${COLORS.line}`,
  },

  headerInner: {
    maxWidth: "1450px",
    margin: "0 auto",
    padding: "32px 7% 18px",
    textAlign: "center",
  },

  publicationLine: {
    fontSize: "7px",
    letterSpacing: "3px",
    fontWeight: 900,
    color: COLORS.sapphire,
  },

  mastheadRule: {
    width: "38px",
    height: "3px",
    background: COLORS.sapphire,
    margin: "15px auto 18px",
  },

  logo: {
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(80px, 13vw, 155px)",
    fontWeight: 400,
    lineHeight: 0.72,
    letterSpacing: "-8px",
  },

  tagline: {
    marginTop: "22px",
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  nav: {
    marginTop: "25px",
    paddingTop: "15px",
    borderTop:
      `1px solid ${COLORS.line}`,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px 30px",
  },

  navLink: {
    color: COLORS.black,
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  /* ========================================
     CURRENT ISSUE
  ======================================== */

  issueSection: {
    background: COLORS.creamSoft,
  },

  issueHero: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "65px 7%",
    display: "grid",
    gridTemplateColumns:
      "minmax(240px, 330px) minmax(0, 1fr)",
    gap:
      "clamp(45px, 8vw, 110px)",
    alignItems: "center",
  },

  issueVisualColumn: {
    width: "100%",
  },

  issueLabel: {
    marginBottom: "12px",
    color: COLORS.sapphire,
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  issueCoverFrame: {
    width: "100%",
    aspectRatio: "3 / 4",
    overflow: "hidden",
    boxShadow:
      "0 25px 50px rgba(5,5,5,0.18)",
  },

  coverPlaceholder: {
    width: "100%",
    height: "100%",
    padding: "24px",
    background:
      `linear-gradient(
        155deg,
        ${COLORS.sapphireDeep},
        ${COLORS.sapphire}
      )`,
    color: COLORS.cream,
    display: "flex",
    flexDirection: "column",
    justifyContent:
      "space-between",
  },

  coverTop: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "55px",
    letterSpacing: "-3px",
    lineHeight: 0.85,
  },

  coverCenter: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  coverIssueWord: {
    fontSize: "7px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  coverIssueNumber: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "50px",
    lineHeight: 1,
  },

  coverBottom: {
    fontSize: "8px",
    lineHeight: 1.4,
    letterSpacing: "2px",
    fontWeight: 900,
    textTransform: "uppercase",
  },

  issueContent: {
    maxWidth: "680px",
  },

  issueKicker: {
    color: COLORS.sapphire,
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  issueTitle: {
    margin: "13px 0 20px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(58px, 8vw, 105px)",
    fontWeight: 400,
    lineHeight: 0.86,
    letterSpacing: "-4px",
  },

  issueDescription: {
    maxWidth: "620px",
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "18px",
    lineHeight: 1.65,
    color: "#3F3A35",
  },

  issueDivider: {
    width: "100%",
    height: "1px",
    background: COLORS.line,
    margin: "25px 0",
  },

  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 21px",
    background: COLORS.sapphire,
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  outlineButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 20px",
    border:
      `1px solid ${COLORS.black}`,
    color: COLORS.black,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  /* ========================================
     COVER STORY
  ======================================== */

  coverStorySection: {
    background: COLORS.cream,
  },

  coverStoryGrid: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.25fr) minmax(320px, 0.75fr)",
  },

  coverStoryImage: {
    minHeight: "520px",
  },

  coverStoryContent: {
    padding:
      "clamp(45px, 7vw, 90px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderLeft:
      `1px solid ${COLORS.line}`,
  },

  coverStoryTitle: {
    margin: "12px 0 18px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(52px, 7vw, 90px)",
    fontWeight: 400,
    lineHeight: 0.88,
    letterSpacing: "-3px",
  },

  coverStoryExcerpt: {
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "17px",
    lineHeight: 1.65,
    color: COLORS.muted,
  },

  coverStoryByline: {
    marginTop: "20px",
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  /* ========================================
     COMMON SECTIONS
  ======================================== */

  creamSection: {
    background: COLORS.cream,
  },

  blackSection: {
    background: COLORS.black,
    color: COLORS.cream,
  },

  sectionInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "70px 7%",
  },

  sectionHeading: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-end",
    gap: "35px",
    paddingBottom: "18px",
    marginBottom: "30px",
    borderBottom: "1px solid",
  },

  eyebrow: {
    marginBottom: "8px",
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  sectionTitle: {
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(42px, 6vw, 70px)",
    fontWeight: 400,
    lineHeight: 0.9,
    letterSpacing: "-2px",
  },

  sectionIntro: {
    maxWidth: "600px",
    margin: "13px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "15px",
    lineHeight: 1.55,
  },

  sectionNumber: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "42px",
  },

  storyMeta: {
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
    textTransform: "uppercase",
  },

  storyExcerpt: {
    margin: "10px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "14px",
    lineHeight: 1.55,
    color: COLORS.muted,
  },

  textLink: {
    display: "inline-block",
    marginTop: "18px",
    color: COLORS.sapphire,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  textLinkSmall: {
    display: "inline-block",
    marginTop: "12px",
    color: COLORS.sapphire,
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.6px",
    fontWeight: 900,
  },

  sectionAction: {
    marginTop: "35px",
  },

  creamButton: {
    display: "inline-flex",
    padding: "14px 21px",
    border:
      `1px solid ${COLORS.cream}`,
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  /* ========================================
     LATEST
  ======================================== */

  latestGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.25fr) minmax(320px, 0.75fr)",
    gap: "35px",
  },

  latestLead: {
    paddingRight: "10px",
  },

  latestLeadImage: {
    width: "100%",
    aspectRatio: "16 / 10",
    overflow: "hidden",
    marginBottom: "17px",
  },

  latestLeadTitle: {
    margin: "10px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(38px, 5vw, 60px)",
    fontWeight: 400,
    lineHeight: 0.95,
    letterSpacing: "-2px",
  },

  latestSecondaryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "25px",
  },

  compactStoryCard: {
    paddingBottom: "20px",
    borderBottom:
      `1px solid ${COLORS.line}`,
  },

  compactStoryImage: {
    width: "100%",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    marginBottom: "13px",
  },

  compactStoryTitle: {
    margin: "8px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "25px",
    fontWeight: 400,
    lineHeight: 1,
  },

  /* ========================================
     SPOTLIGHT
  ======================================== */

  spotlightGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "24px",
  },

  spotlightCard: {
    borderTop:
      `3px solid ${COLORS.sapphire}`,
  },

  spotlightImage: {
    width: "100%",
    aspectRatio: "4 / 5",
    overflow: "hidden",
  },

  spotlightCopy: {
    padding: "18px 0 0",
  },

  spotlightName: {
    margin: 0,
    color: COLORS.cream,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "30px",
    fontWeight: 400,
    lineHeight: 1,
  },

  spotlightRole: {
    margin: "8px 0 0",
    color:
      "rgba(244,239,230,0.62)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "14px",
    lineHeight: 1.5,
  },

  spotlightReadLink: {
    display: "inline-block",
    marginTop: "14px",
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.7px",
    fontWeight: 900,
  },

  /* ========================================
     FILM + TV
  ======================================== */

  filmGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.25fr) minmax(300px, 0.75fr)",
    gap: "35px",
  },

  filmLead: {
    minWidth: 0,
  },

  filmLeadImage: {
    width: "100%",
    aspectRatio: "16 / 10",
    overflow: "hidden",
    marginBottom: "17px",
  },

  filmLeadTitle: {
    margin: "9px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(38px, 5vw, 58px)",
    lineHeight: 0.95,
    fontWeight: 400,
    letterSpacing: "-2px",
  },

  filmSideGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "25px",
  },

  filmSideCard: {
    display: "grid",
    gridTemplateColumns:
      "minmax(120px, 0.8fr) minmax(0, 1fr)",
    gap: "18px",
    paddingBottom: "20px",
    borderBottom:
      `1px solid ${COLORS.line}`,
  },

  filmSideImage: {
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
  },

  filmSideTitle: {
    margin: "8px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "25px",
    lineHeight: 1,
    fontWeight: 400,
  },
    /* ========================================
     CULTURE
  ======================================== */

  cultureSection: {
    background: COLORS.creamSoft,
  },

  cultureGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.35fr) minmax(280px, 0.65fr)",
    gap: "35px",
    alignItems: "stretch",
  },

  cultureLead: {
    minWidth: 0,
  },

  cultureLeadImage: {
    width: "100%",
    aspectRatio: "16 / 9",
    overflow: "hidden",
  },

  cultureLeadCopy: {
    paddingTop: "18px",
    maxWidth: "760px",
  },

  cultureLeadTitle: {
    margin: "9px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(42px, 6vw, 70px)",
    fontWeight: 400,
    lineHeight: 0.92,
    letterSpacing: "-2px",
  },

  cultureSecondary: {
    padding: "32px",
    background: COLORS.cream,
    borderTop:
      `5px solid ${COLORS.sapphire}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  cultureSecondaryNumber: {
    marginBottom: "30px",
    color:
      "rgba(5,5,5,0.15)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "60px",
    lineHeight: 1,
  },

  cultureSecondaryTitle: {
    margin: "10px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(32px, 4vw, 48px)",
    fontWeight: 400,
    lineHeight: 0.95,
    letterSpacing: "-1px",
  },

  /* ========================================
     BEAUTY + STYLE
  ======================================== */

  styleSection: {
    background: COLORS.sapphire,
    color: COLORS.cream,
  },

  styleGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "25px",
  },

  styleCard: {
    minWidth: 0,
  },

  styleImage: {
    width: "100%",
    aspectRatio: "4 / 5",
    overflow: "hidden",
    marginBottom: "17px",
    background: COLORS.sapphireDeep,
  },

  styleTitle: {
    margin: "9px 0 0",
    color: COLORS.cream,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "30px",
    fontWeight: 400,
    lineHeight: 0.98,
  },

  styleExcerpt: {
    margin: "10px 0 0",
    color:
      "rgba(244,239,230,0.72)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "14px",
    lineHeight: 1.55,
  },

  styleReadLink: {
    display: "inline-block",
    marginTop: "15px",
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.7px",
    fontWeight: 900,
  },

  /* ========================================
     ASET ORIGINALS
  ======================================== */

  originalsSection: {
    background: COLORS.cream,
  },

  originalGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
    borderTop:
      `1px solid ${COLORS.line}`,
    borderBottom:
      `1px solid ${COLORS.line}`,
  },

  originalImage: {
    minHeight: "500px",
    overflow: "hidden",
  },

  originalContent: {
    padding:
      "clamp(40px, 6vw, 75px)",
    borderLeft:
      `1px solid ${COLORS.line}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  originalTitle: {
    margin: "12px 0 18px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(46px, 6vw, 74px)",
    fontWeight: 400,
    lineHeight: 0.9,
    letterSpacing: "-2px",
  },

  originalExcerpt: {
    margin: "0 0 25px",
    color: COLORS.muted,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "17px",
    lineHeight: 1.65,
  },

  /* ========================================
     ANI
  ======================================== */

  aniSection: {
    background: COLORS.black,
    color: COLORS.cream,
  },

  aniInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "80px 7%",
    display: "grid",
    gridTemplateColumns:
      "minmax(280px, 0.75fr) minmax(0, 1.25fr)",
    gap: "65px",
    alignItems: "center",
  },

  aniBrand: {
    paddingRight: "55px",
    borderRight:
      `1px solid ${COLORS.lightLine}`,
  },

  aniKicker: {
    marginBottom: "18px",
    color:
      "rgba(244,239,230,0.55)",
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  aniLogo: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(55px, 7vw, 92px)",
    fontWeight: 400,
    lineHeight: 0.78,
    letterSpacing: "-3px",
  },

  aniMark: {
    marginTop: "27px",
    fontSize: "9px",
    letterSpacing: "5px",
    fontWeight: 900,
  },

  aniFeature: {
    maxWidth: "680px",
  },

  aniFeatureTitle: {
    margin: "13px 0 18px",
    color: COLORS.cream,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(46px, 6vw, 72px)",
    fontWeight: 400,
    lineHeight: 0.92,
    letterSpacing: "-2px",
  },

  aniFeatureExcerpt: {
    margin: 0,
    color:
      "rgba(244,239,230,0.72)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "17px",
    lineHeight: 1.65,
  },

  aniButton: {
    display: "inline-flex",
    marginTop: "27px",
    padding: "14px 21px",
    border:
      `1px solid ${COLORS.cream}`,
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  /* ========================================
     FROM THE EDITOR
  ======================================== */

  editorSection: {
    background: COLORS.creamSoft,
  },

  editorInner: {
    maxWidth: "900px",
    margin: "0 auto",
    padding:
      "clamp(70px, 9vw, 110px) 7%",
    textAlign: "center",
  },

  editorEyebrow: {
    color: COLORS.sapphire,
    fontSize: "8px",
    letterSpacing: "4px",
    fontWeight: 900,
  },

  editorRule: {
    width: "42px",
    height: "3px",
    margin: "19px auto 25px",
    background: COLORS.sapphire,
  },

  editorQuote: {
    margin: 0,
    padding: 0,
    border: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(30px, 5vw, 54px)",
    fontStyle: "italic",
    fontWeight: 400,
    lineHeight: 1.1,
  },

  editorSignature: {
    marginTop: "25px",
    color: COLORS.muted,
    fontSize: "7px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  /* ========================================
     ISSUES / NEWSSTAND
  ======================================== */

  issuesSection: {
    background: COLORS.cream,
  },

  issueArchiveGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 280px))",
    gap: "35px",
    alignItems: "start",
  },

  archiveCard: {
    minWidth: 0,
  },

  archiveCoverLink: {
    display: "block",
    color: "inherit",
    textDecoration: "none",
  },

  archiveCover: {
    width: "100%",
    aspectRatio: "3 / 4",
    overflow: "hidden",
    boxShadow:
      "0 18px 35px rgba(5,5,5,0.15)",
  },

  archiveCoverPlaceholder: {
    width: "100%",
    height: "100%",
    padding: "20px",
    background:
      `linear-gradient(
        155deg,
        ${COLORS.sapphireDeep},
        ${COLORS.sapphire}
      )`,
    color: COLORS.cream,
    display: "flex",
    flexDirection: "column",
    justifyContent:
      "space-between",
  },

  archiveLogo: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "48px",
    letterSpacing: "-3px",
    lineHeight: 0.85,
  },

  archiveIssueNumber: {
    alignSelf: "center",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "60px",
    lineHeight: 1,
  },

  archiveCoverTitle: {
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
    textTransform: "uppercase",
  },

  archiveMeta: {
    paddingTop: "16px",
  },

  archiveNumber: {
    color: COLORS.sapphire,
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  archiveTitle: {
    margin: "7px 0 5px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "27px",
    fontWeight: 400,
    lineHeight: 1,
  },

  archiveDate: {
    color: COLORS.muted,
    fontSize: "8px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },

  /* ========================================
     IMAGE PLACEHOLDERS
  ======================================== */

  fullImage: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  imagePlaceholder: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "220px",
    overflow: "hidden",
    background:
      "linear-gradient(145deg, #DED7CC, #F4EFE6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  imagePlaceholderDark: {
    background:
      "linear-gradient(145deg, #050505, #191919)",
  },

  imagePlaceholderText: {
    color:
      "rgba(5,5,5,0.22)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(28px, 4vw, 54px)",
    letterSpacing: "-2px",
    textAlign: "center",
    padding: "25px",
    textTransform: "uppercase",
  },

  imagePlaceholderTextDark: {
    color:
      "rgba(244,239,230,0.20)",
  },

  /* ========================================
     FOOTER
  ======================================== */

  footer: {
    background: COLORS.black,
    color: COLORS.cream,
  },

  footerInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "60px 7% 30px",
    textAlign: "center",
  },

  footerLogo: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "76px",
    letterSpacing: "-4px",
    lineHeight: 0.85,
  },

  footerBlueRule: {
    width: "40px",
    height: "3px",
    margin: "21px auto",
    background: COLORS.sapphire,
  },

  footerTagline: {
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  footerPublication: {
    margin: "10px 0 0",
    color:
      "rgba(244,239,230,0.55)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "13px",
    fontStyle: "italic",
  },

  footerLinks: {
    marginTop: "30px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px 25px",
  },

  footerLink: {
    color:
      "rgba(244,239,230,0.72)",
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  copyright: {
    marginTop: "35px",
    paddingTop: "20px",
    borderTop:
      `1px solid ${COLORS.lightLine}`,
    color:
      "rgba(244,239,230,0.35)",
    fontSize: "7px",
    letterSpacing: "2px",
  },
};

export default AsetMagazinePage;
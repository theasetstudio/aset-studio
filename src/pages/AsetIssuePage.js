import React, { useMemo } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

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
  muted: "#68635D",
  line: "rgba(5,5,5,0.16)",
  lightLine: "rgba(244,239,230,0.18)",
};

/* ==========================================
   ISSUE 001 EDITORIAL FALLBACK

   This preserves the original Premiere Issue.
   Admin/localStorage can update these stories
   without destroying the original editorial
   material.
========================================== */

const issues = {
  "issue-001": {
    number: "001",
    title: "The Premiere Issue",
    date: "September 2026",

    description:
      "The first issue of ASET begins a new chapter in entertainment, culture, creativity, visual storytelling, and original editorial publishing from The Aset Studio.",

    coverImage: "",

    editorNote:
      "ASET was created to give stories, talent, creativity, entertainment, and original ideas another place to live.",

    sections: [
      {
        id: "cover-story",
        number: "01",
        label: "COVER STORY",
        title: "ASET Begins Here",
        description:
          "A new editorial platform enters The Aset Studio ecosystem, created to spotlight entertainment, talent, culture, original stories, and the people shaping what comes next.",
        image: "",
        slug: "aset-begins-here",
        featured: true,
      },

      {
        id: "spotlight",
        number: "02",
        label: "ASET SPOTLIGHT",
        title: "The People Behind the Culture",
        description:
          "ASET Spotlight expands into long-form editorial profiles and conversations with creatives, performers, and entertainment professionals.",
        image: "",
        slug: "people-behind-the-culture",
      },

      {
        id: "television",
        number: "03",
        label: "FILM + TELEVISION",
        title:
          "What Makes Television Worth Talking About?",
        description:
          "Characters, performances, storytelling, and the moments that keep audiences watching.",
        image: "",
        slug: "television-worth-talking-about",
      },

      {
        id: "culture",
        number: "04",
        label: "CULTURE",
        title:
          "Entertainment Is More Than the Screen",
        description:
          "How style, conversation, fandom, music, and visual culture become part of the story.",
        image: "",
        slug: "entertainment-beyond-the-screen",
      },

      {
        id: "style",
        number: "05",
        label: "BEAUTY + STYLE",
        title: "The Editorial Image",
        description:
          "Photography, beauty, fashion, and visual identity meet inside the world of ASET.",
        image: "",
        slug: "the-editorial-image",
      },

      {
        id: "performances",
        number: "06",
        label: "FILM + TELEVISION",
        title: "The Performances We Remember",
        description:
          "A closer look at the performances and creative choices that remain part of the conversation.",
        image: "",
        slug: "performances-we-remember",
      },

      {
        id: "characters",
        number: "07",
        label: "COMMENTARY",
        title:
          "Characters That Take Over the Conversation",
        description:
          "Sometimes one character becomes impossible for an audience to stop discussing.",
        image: "",
        slug: "characters-that-take-over",
      },

      {
        id: "industry",
        number: "08",
        label: "INDUSTRY",
        title: "Inside Modern Entertainment",
        description:
          "Exploring an entertainment landscape where stories move between screens, platforms, publications, and audiences.",
        image: "",
        slug: "inside-modern-entertainment",
      },

      {
        id: "culture-camera",
        number: "09",
        label: "CULTURE",
        title: "The Culture Behind the Camera",
        description:
          "The creative worlds surrounding entertainment can become just as influential as what appears on screen.",
        image: "",
        slug: "culture-behind-the-camera",
      },

      {
        id: "beauty",
        number: "10",
        label: "BEAUTY + STYLE",
        title: "Beauty as Storytelling",
        description:
          "Beauty can establish character, atmosphere, visual identity, and editorial direction.",
        image: "",
        slug: "beauty-as-storytelling",
      },

      {
        id: "editorial-look",
        number: "11",
        label: "BEAUTY + STYLE",
        title: "Creating the Editorial Look",
        description:
          "A strong editorial image begins long before the shutter is pressed.",
        image: "",
        slug: "creating-editorial-look",
      },

      {
        id: "photography",
        number: "12",
        label: "PHOTOGRAPHY",
        title:
          "Inside The Aset Studio Photography Room",
        description:
          "Photography becomes another storytelling language inside The Aset Studio.",
        image: "",
        slug: "aset-photography-room",
      },

      {
        id: "originals",
        number: "13",
        label: "ASET ORIGINALS",
        title: "Building Original Worlds",
        description:
          "A look inside the concepts, visual development, and entertainment properties being created by The Aset Studio.",
        image: "",
        slug: "building-original-worlds",
      },

      {
        id: "ani",
        number: "14",
        label: "AIN'T NOBODY INNOCENT",
        title: "Inside the World of ANI",
        description:
          "Characters, locations, visual development, production concepts, and exclusive editorial material from The Aset Studio's original entertainment property.",
        image: "",
        slug: "inside-the-world-of-ani",
        dark: true,
      },
    ],
  },
};

/* ==========================================
   ADMIN / LOCALSTORAGE ISSUE BRIDGE
========================================== */

const ISSUE_STORAGE_KEY =
  "aset_magazine_issues";

const ARTICLE_STORAGE_KEY =
  "aset_magazine_articles";

function readLocalCollection(key) {
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

function normalizeIssueSlug(
  value = ""
) {
  const raw = String(value)
    .trim()
    .toLowerCase();

  if (!raw) {
    return "";
  }

  if (/^issue-\d+$/.test(raw)) {
    return raw;
  }

  const numberMatch =
    raw.match(/(\d+)/);

  if (numberMatch) {
    return `issue-${numberMatch[1].padStart(
      3,
      "0"
    )}`;
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

function normalizeIssueNumber(
  value = ""
) {
  const match =
    String(value).match(/(\d+)/);

  return match
    ? match[1].padStart(
        3,
        "0"
      )
    : "";
}

function articleBelongsToIssue(
  article,
  issueSlug,
  issueNumber
) {
  const assignment =
    String(
      article?.issue || ""
    ).trim();

  if (
    !assignment ||
    assignment.toLowerCase() ===
      "unassigned"
  ) {
    return false;
  }

  if (
    normalizeIssueSlug(
      assignment
    ) === issueSlug
  ) {
    return true;
  }

  const assignmentNumber =
    normalizeIssueNumber(
      assignment
    );

  return Boolean(
    assignmentNumber &&
      issueNumber &&
      assignmentNumber ===
        issueNumber
  );
}

function normalizeStoryFromAdmin(
  article,
  index,
  baseStory
) {
  const category =
    article?.category?.trim() ||
    baseStory?.label ||
    "ASET EDITORIAL";

  return {
    ...(baseStory || {}),

    id:
      article?.id ||
      baseStory?.id ||
      article?.slug ||
      `story-${index + 1}`,

    number:
      String(
        index + 1
      ).padStart(
        2,
        "0"
      ),

    label:
      category.toUpperCase(),

    title:
      article?.title?.trim() ||
      baseStory?.title ||
      "Untitled Story",

    description:
      article?.excerpt?.trim() ||
      baseStory?.description ||
      "",

    image:
      article?.image?.trim() ||
      baseStory?.image ||
      "",

    slug:
      article?.slug ||
      baseStory?.slug ||
      "",

    featured:
      Boolean(
        article?.coverStory ||
          baseStory?.featured
      ),

    dark:
      Boolean(
        baseStory?.dark
      ) ||
      category.toUpperCase() ===
        "ANI" ||
      category
        .toUpperCase()
        .includes(
          "AIN'T NOBODY INNOCENT"
        ),
  };
}

function buildPublicIssue(slug) {
  const fallbackIssue =
    issues[slug] || null;

  const storedIssues =
    readLocalCollection(
      ISSUE_STORAGE_KEY
    );

  const storedArticles =
    readLocalCollection(
      ARTICLE_STORAGE_KEY
    );

  const adminIssue =
    storedIssues.find(
      (item) => {
        const itemSlug =
          item?.slug ||
          normalizeIssueSlug(
            item?.number ||
              item?.title ||
              ""
          );

        return (
          itemSlug === slug
        );
      }
    );

  /*
   * If Admin contains the issue
   * but it is not published,
   * do not expose it publicly.
   */
  if (
    adminIssue &&
    adminIssue.status &&
    adminIssue.status !==
      "Published"
  ) {
    return null;
  }

  /*
   * Unknown issue.
   */
  if (
    !fallbackIssue &&
    !adminIssue
  ) {
    return null;
  }

  const issueNumber =
    normalizeIssueNumber(
      adminIssue?.number ||
        fallbackIssue?.number ||
        slug
    ) || "001";

  const publishedAdminArticles =
    storedArticles.filter(
      (article) =>
        article?.status ===
          "Published" &&
        articleBelongsToIssue(
          article,
          slug,
          issueNumber
        )
    );

  const fallbackSections =
    fallbackIssue?.sections ||
    [];

  /*
   * Merge Admin records into
   * Issue 001's established
   * editorial stories.
   */
  const mergedFallbackStories =
    fallbackSections
      .map(
        (baseStory) => {
          const matchingRecords =
            storedArticles.filter(
              (article) =>
                article.slug ===
                  baseStory.slug &&
                articleBelongsToIssue(
                  article,
                  slug,
                  issueNumber
                )
            );

          const adminArticle =
            matchingRecords.find(
              (article) =>
                article.status ===
                "Published"
            );

          /*
           * If the Admin version
           * exists only as Draft,
           * hide it publicly.
           */
          const hasDraftOverride =
            matchingRecords.length >
              0 &&
            !adminArticle;

          if (
            hasDraftOverride
          ) {
            return null;
          }

          if (
            !adminArticle
          ) {
            return {
              ...baseStory,
            };
          }

          return normalizeStoryFromAdmin(
            adminArticle,
            Number(
              baseStory.number
            ) - 1,
            baseStory
          );
        }
      )
      .filter(Boolean);

  /*
   * Add brand-new published
   * Admin stories.
   */
  const newAdminStories =
    publishedAdminArticles
      .filter(
        (article) =>
          !fallbackSections.some(
            (story) =>
              story.slug ===
              article.slug
          )
      )
      .map(
        (
          article,
          index
        ) =>
          normalizeStoryFromAdmin(
            article,
            mergedFallbackStories.length +
              index,
            null
          )
      );

  let sections = [
    ...mergedFallbackStories,
    ...newAdminStories,
  ];

  /*
   * The Admin Cover Story flag
   * controls the public issue.
   */
  const adminCover =
    publishedAdminArticles.find(
      (article) =>
        article.coverStory
    );

  if (adminCover) {
    sections =
      sections.map(
        (story) => ({
          ...story,

          featured:
            story.slug ===
            adminCover.slug,
        })
      );
  }

  /*
   * Renumber after drafts and
   * new stories are resolved.
   */
  sections =
    sections.map(
      (
        story,
        index
      ) => ({
        ...story,

        number:
          String(
            index + 1
          ).padStart(
            2,
            "0"
          ),
      })
    );

  return {
    ...(fallbackIssue || {}),
    ...(adminIssue || {}),

    number:
      issueNumber,

    title:
      adminIssue?.title?.trim() ||
      fallbackIssue?.title ||
      `Issue ${issueNumber}`,

    date:
      adminIssue?.date?.trim() ||
      fallbackIssue?.date ||
      "",

    description:
      adminIssue?.description?.trim() ||
      fallbackIssue?.description ||
      "",

    coverImage:
      adminIssue?.coverImage?.trim() ||
      adminIssue?.cover_image?.trim() ||
      fallbackIssue?.coverImage ||
      "",

    editorNote:
      adminIssue?.editorNote?.trim() ||
      adminIssue?.editor_note?.trim() ||
      fallbackIssue?.editorNote ||
      "ASET brings entertainment, culture, creativity, and original editorial storytelling together inside The Aset Studio.",

    sections,
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
      <div
        style={{
          ...styles.imagePlaceholderLogo,
          color: dark
            ? "rgba(244,239,230,0.18)"
            : "rgba(5,5,5,0.13)",
        }}
      >
        ASET
      </div>

      <div
        style={{
          ...styles.imagePlaceholderLabel,
          color: dark
            ? "rgba(244,239,230,0.42)"
            : COLORS.sapphire,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ==========================================
   ISSUE PAGE
========================================== */

function AsetIssuePage() {
  const { slug } = useParams();

  const issue = useMemo(
    () => buildPublicIssue(slug),
    [slug]
  );

  if (!issue) {
    return <IssueNotFound />;
  }

  const featuredStory =
    issue.sections.find(
      (story) => story.featured
    );

  const regularStories =
    issue.sections.filter(
      (story) => !story.featured
    );

  const aniStories =
    regularStories.filter(
      (story) =>
        story.dark ||
        story.label ===
          "AIN'T NOBODY INNOCENT" ||
        story.label === "ANI"
    );

  const standardStories =
    regularStories.filter(
      (story) =>
        !story.dark &&
        story.label !==
          "AIN'T NOBODY INNOCENT" &&
        story.label !== "ANI"
    );

  return (
    <main style={styles.page}>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          .aset-issue-link {
            transition:
              opacity 160ms ease,
              transform 160ms ease;
          }

          .aset-issue-link:hover {
            opacity: 0.7;
          }

          .aset-issue-card {
            transition:
              transform 180ms ease;
          }

          .aset-issue-card:hover {
            transform: translateY(-3px);
          }

          @media (max-width: 1000px) {
            .aset-issue-opening {
              grid-template-columns:
                minmax(240px, 320px)
                minmax(0, 1fr) !important;
            }

            .aset-feature-grid,
            .aset-ani-grid {
              grid-template-columns:
                1fr !important;
            }

            .aset-story-grid {
              grid-template-columns:
                repeat(
                  2,
                  minmax(0, 1fr)
                ) !important;
            }

            .aset-ani-brand {
              border-right: 0 !important;
              border-bottom:
                1px solid
                rgba(
                  244,
                  239,
                  230,
                  0.18
                ) !important;
              padding-right:
                0 !important;
              padding-bottom:
                40px !important;
            }
          }

          @media (max-width: 760px) {
            .aset-issue-opening {
              grid-template-columns:
                1fr !important;
            }

            .aset-issue-cover-wrap {
              max-width: 340px;
              margin: 0 auto;
            }

            .aset-story-grid {
              grid-template-columns:
                1fr !important;
            }

            .aset-issue-topbar {
              grid-template-columns:
                1fr auto !important;
            }

            .aset-topbar-center {
              display: none !important;
            }

            .aset-contents-row {
              grid-template-columns:
                48px 1fr !important;
            }

            .aset-contents-category {
              display: none !important;
            }
          }

          @media (max-width: 560px) {
            .aset-issue-wrap {
              padding-left:
                6% !important;
              padding-right:
                6% !important;
            }

            .aset-issue-title {
              font-size:
                54px !important;
            }

            .aset-feature-title {
              font-size:
                48px !important;
            }

            .aset-ani-title {
              font-size:
                54px !important;
            }
          }
        `}
      </style>

      {/* =====================================
          ISSUE TOP BAR
      ===================================== */}

      <header style={styles.topBar}>
        <div
          className="aset-issue-topbar aset-issue-wrap"
          style={styles.topBarInner}
        >
          <Link
            to="/aset"
            className="aset-issue-link"
            style={styles.backLink}
          >
            ← ASET
          </Link>

          <Link
            to="/aset"
            className="aset-issue-link aset-topbar-center"
            style={styles.topBarLogo}
          >
            ASET
          </Link>

          <div
            style={
              styles.topBarIssue
            }
          >
            ISSUE {issue.number}
          </div>
        </div>
      </header>

      {/* =====================================
          ISSUE OPENING
      ===================================== */}

      <section
        style={
          styles.openingSection
        }
      >
        <div
          className="aset-issue-opening aset-issue-wrap"
          style={styles.openingGrid}
        >
          {/* COVER */}

          <div
            className="aset-issue-cover-wrap"
            style={styles.coverColumn}
          >
            <div
              style={
                styles.currentLabel
              }
            >
              CURRENT EDITION
            </div>

            <div style={styles.cover}>
              {issue.coverImage ? (
                <img
                  src={
                    issue.coverImage
                  }
                  alt={`ASET ${issue.title}`}
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
                      styles.coverLogo
                    }
                  >
                    ASET
                  </div>

                  <div
                    style={
                      styles.coverCenter
                    }
                  >
                    <div
                      style={
                        styles.coverIssueLabel
                      }
                    >
                      {issue.title.toUpperCase()}
                    </div>

                    <div
                      style={
                        styles.coverNumber
                      }
                    >
                      {issue.number}
                    </div>
                  </div>

                  <div
                    style={
                      styles.coverBottom
                    }
                  >
                    ENTERTAINMENT
                    <br />
                    CULTURE
                    <br />
                    CREATIVITY
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ISSUE INFORMATION */}

          <div
            style={
              styles.openingContent
            }
          >
            <div
              style={
                styles.issueEyebrow
              }
            >
              ASET · ISSUE{" "}
              {issue.number}
            </div>

            <h1
              className="aset-issue-title"
              style={styles.issueTitle}
            >
              {issue.title}
            </h1>

            {issue.date && (
              <div
                style={
                  styles.issueDate
                }
              >
                {issue.date}
              </div>
            )}

            <div
              style={
                styles.openingRule
              }
            />

            {issue.description && (
              <p
                style={
                  styles.issueDescription
                }
              >
                {
                  issue.description
                }
              </p>
            )}

            <div
              style={
                styles.issueStats
              }
            >
              <div>
                <div
                  style={
                    styles.statNumber
                  }
                >
                  {
                    issue.sections
                      .length
                  }
                </div>

                <div
                  style={
                    styles.statLabel
                  }
                >
                  STORIES
                </div>
              </div>

              <div>
                <div
                  style={
                    styles.statNumber
                  }
                >
                  {issue.number}
                </div>

                <div
                  style={
                    styles.statLabel
                  }
                >
                  EDITION
                </div>
              </div>

              <div>
                <div
                  style={
                    styles.statNumber
                  }
                >
                  ASET
                </div>

                <div
                  style={
                    styles.statLabel
                  }
                >
                  THE ASET STUDIO
                </div>
              </div>
            </div>

            <a
              href="#contents"
              style={
                styles.primaryButton
              }
            >
              EXPLORE THE ISSUE
            </a>
          </div>
        </div>
      </section>

      {/* =====================================
          EDITOR NOTE
      ===================================== */}

      {issue.editorNote && (
        <section
          style={
            styles.editorSection
          }
        >
          <div
            className="aset-issue-wrap"
            style={
              styles.editorInner
            }
          >
            <div
              style={
                styles.editorEyebrow
              }
            >
              FROM THE EDITOR
            </div>

            <blockquote
              style={
                styles.editorQuote
              }
            >
              “{issue.editorNote}”
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
      )}

      {/* =====================================
          CONTENTS
      ===================================== */}

      <section
        id="contents"
        style={
          styles.contentsSection
        }
      >
        <div
          className="aset-issue-wrap"
          style={
            styles.contentsInner
          }
        >
          <div
            style={
              styles.sectionTop
            }
          >
            <div>
              <div
                style={
                  styles.sectionEyebrow
                }
              >
                INSIDE
              </div>

              <h2
                style={
                  styles.sectionTitle
                }
              >
                Contents
              </h2>
            </div>

            <div
              style={
                styles.sectionNumber
              }
            >
              {issue.number}
            </div>
          </div>

          {issue.sections.length >
          0 ? (
            <div
              style={
                styles.contentsList
              }
            >
              {issue.sections.map(
                (story) => (
                  <Link
                    key={
                      story.id
                    }
                    to={`/aset/articles/${story.slug}`}
                    className="aset-issue-link aset-contents-row"
                    style={
                      styles.contentsRow
                    }
                  >
                    <div
                      style={
                        styles.contentsNumber
                      }
                    >
                      {
                        story.number
                      }
                    </div>

                    <div>
                      <div
                        style={
                          styles.contentsLabel
                        }
                      >
                        {
                          story.label
                        }
                      </div>

                      <div
                        style={
                          styles.contentsTitle
                        }
                      >
                        {
                          story.title
                        }
                      </div>
                    </div>

                    <div
                      className="aset-contents-category"
                      style={
                        styles.contentsArrow
                      }
                    >
                      READ →
                    </div>
                  </Link>
                )
              )}
            </div>
          ) : (
            <div
              style={
                styles.emptyIssue
              }
            >
              <div
                style={
                  styles.emptyIssueLabel
                }
              >
                ASET EDITORIAL
              </div>

              <h3
                style={
                  styles.emptyIssueTitle
                }
              >
                Stories are being
                prepared.
              </h3>

              <p
                style={
                  styles.emptyIssueText
                }
              >
                Published stories
                assigned to this
                issue will appear
                here automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================
          COVER STORY
      ===================================== */}

      {featuredStory && (
        <section
          style={
            styles.featureSection
          }
        >
          <div
            className="aset-feature-grid"
            style={
              styles.featureGrid
            }
          >
            <div
              style={
                styles.featureImage
              }
            >
              {featuredStory.image ? (
                <img
                  src={
                    featuredStory.image
                  }
                  alt={
                    featuredStory.title
                  }
                  style={
                    styles.fullImage
                  }
                />
              ) : (
                <ImagePlaceholder
                  label="COVER STORY"
                />
              )}
            </div>

            <div
              style={
                styles.featureContent
              }
            >
              <div
                style={
                  styles.featureNumber
                }
              >
                {
                  featuredStory.number
                }
              </div>

              <div
                style={
                  styles.storyCategory
                }
              >
                {
                  featuredStory.label
                }
              </div>

              <h2
                className="aset-feature-title"
                style={
                  styles.featureTitle
                }
              >
                {
                  featuredStory.title
                }
              </h2>

              {featuredStory.description && (
                <p
                  style={
                    styles.featureDescription
                  }
                >
                  {
                    featuredStory.description
                  }
                </p>
              )}

              <Link
                to={`/aset/articles/${featuredStory.slug}`}
                className="aset-issue-link"
                style={
                  styles.storyButton
                }
              >
                READ COVER STORY
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =====================================
          ISSUE STORIES
      ===================================== */}

      {standardStories.length >
        0 && (
        <section
          style={
            styles.storiesSection
          }
        >
          <div
            className="aset-issue-wrap"
            style={
              styles.storiesInner
            }
          >
            <div
              style={
                styles.sectionTop
              }
            >
              <div>
                <div
                  style={
                    styles.sectionEyebrow
                  }
                >
                  {issue.title.toUpperCase()}
                </div>

                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  Stories
                </h2>
              </div>

              <div
                style={
                  styles.sectionNumber
                }
              >
                ASET
              </div>
            </div>

            <div
              className="aset-story-grid"
              style={
                styles.storyGrid
              }
            >
              {standardStories.map(
                (story) => (
                  <article
                    key={
                      story.id
                    }
                    className="aset-issue-card"
                    style={
                      styles.storyCard
                    }
                  >
                    <div
                      style={
                        styles.storyImage
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
                            story.label
                          }
                        />
                      )}
                    </div>

                    <div
                      style={
                        styles.storyNumber
                      }
                    >
                      {
                        story.number
                      }
                    </div>

                    <div
                      style={
                        styles.storyCategory
                      }
                    >
                      {
                        story.label
                      }
                    </div>

                    <h3
                      style={
                        styles.storyTitle
                      }
                    >
                      {
                        story.title
                      }
                    </h3>

                    {story.description && (
                      <p
                        style={
                          styles.storyDescription
                        }
                      >
                        {
                          story.description
                        }
                      </p>
                    )}

                    <Link
                      to={`/aset/articles/${story.slug}`}
                      className="aset-issue-link"
                      style={
                        styles.storyTextLink
                      }
                    >
                      READ STORY →
                    </Link>
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      )}
            {/* =====================================
          ANI FEATURE
      ===================================== */}

      {aniStories.map(
        (aniStory) => (
          <section
            key={aniStory.id}
            style={styles.aniSection}
          >
            <div
              className="aset-ani-grid aset-issue-wrap"
              style={styles.aniGrid}
            >
              <div
                className="aset-ani-brand"
                style={styles.aniBrand}
              >
                <div
                  style={
                    styles.aniEyebrow
                  }
                >
                  ASET ORIGINAL SERIES
                </div>

                <h2
                  className="aset-ani-title"
                  style={styles.aniTitle}
                >
                  AIN'T
                  <br />
                  NOBODY
                  <br />
                  INNOCENT
                </h2>

                <div
                  style={
                    styles.aniShort
                  }
                >
                  ANI
                </div>
              </div>

              <div
                style={
                  styles.aniStory
                }
              >
                <div
                  style={
                    styles.aniStoryNumber
                  }
                >
                  {aniStory.number}
                </div>

                <div
                  style={
                    styles.aniStoryLabel
                  }
                >
                  EXCLUSIVE FEATURE
                </div>

                <h3
                  style={
                    styles.aniStoryTitle
                  }
                >
                  {aniStory.title}
                </h3>

                {aniStory.description && (
                  <p
                    style={
                      styles.aniDescription
                    }
                  >
                    {
                      aniStory.description
                    }
                  </p>
                )}

                <Link
                  to={`/aset/articles/${aniStory.slug}`}
                  className="aset-issue-link"
                  style={
                    styles.aniButton
                  }
                >
                  ENTER THE FEATURE
                </Link>
              </div>
            </div>
          </section>
        )
      )}

      {/* =====================================
          END OF ISSUE
      ===================================== */}

      <section
        style={styles.endSection}
      >
        <div
          style={styles.endInner}
        >
          <div
            style={
              styles.endEyebrow
            }
          >
            END OF ISSUE{" "}
            {issue.number}
          </div>

          <div
            style={styles.endLogo}
          >
            ASET
          </div>

          <p
            style={styles.endText}
          >
            {issue.title}
          </p>

          <div
            style={styles.endRule}
          />

          <Link
            to="/aset"
            style={
              styles.returnButton
            }
          >
            RETURN TO ASET
          </Link>
        </div>
      </section>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer style={styles.footer}>
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
          style={
            styles.footerLinks
          }
        >
          <Link
            to="/"
            style={
              styles.footerLink
            }
          >
            THE ASET STUDIO
          </Link>

          <Link
            to="/aset"
            style={
              styles.footerLink
            }
          >
            ASET MAGAZINE
          </Link>

          <Link
            to="/aset-spotlight"
            style={
              styles.footerLink
            }
          >
            ASET SPOTLIGHT
          </Link>

          <Link
            to="/videos"
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
      </footer>
    </main>
  );
}

/* ==========================================
   ISSUE NOT FOUND
========================================== */

function IssueNotFound() {
  return (
    <main
      style={styles.notFoundPage}
    >
      <div
        style={styles.notFoundLogo}
      >
        ASET
      </div>

      <div
        style={styles.notFoundRule}
      />

      <div
        style={
          styles.notFoundLabel
        }
      >
        THE NEWSSTAND
      </div>

      <h1
        style={styles.notFoundTitle}
      >
        Issue
        <br />
        Not Found
      </h1>

      <p
        style={styles.notFoundText}
      >
        This edition of ASET is not
        available yet.
      </p>

      <Link
        to="/aset"
        style={
          styles.notFoundButton
        }
      >
        RETURN TO ASET
      </Link>
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
     TOP BAR
  ======================================== */

  topBar: {
    background: COLORS.cream,
    borderBottom:
      `1px solid ${COLORS.line}`,
  },

  topBarInner: {
    maxWidth: "1450px",
    margin: "0 auto",
    padding: "14px 7%",
    display: "grid",
    gridTemplateColumns:
      "1fr auto 1fr",
    alignItems: "center",
  },

  backLink: {
    justifySelf: "start",
    color: COLORS.black,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  topBarLogo: {
    justifySelf: "center",
    color: COLORS.black,
    textDecoration: "none",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "30px",
    letterSpacing: "-1px",
    lineHeight: 1,
  },

  topBarIssue: {
    justifySelf: "end",
    fontSize: "8px",
    letterSpacing: "2px",
    fontWeight: 900,
    color: COLORS.sapphire,
  },

  /* ========================================
     OPENING
  ======================================== */

  openingSection: {
    background:
      COLORS.creamSoft,
  },

  openingGrid: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "64px 7%",
    display: "grid",
    gridTemplateColumns:
      "minmax(260px, 360px) minmax(0, 1fr)",
    gap:
      "clamp(45px, 8vw, 110px)",
    alignItems: "center",
  },

  coverColumn: {
    width: "100%",
  },

  currentLabel: {
    marginBottom: "13px",
    color: COLORS.sapphire,
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  cover: {
    width: "100%",
    aspectRatio: "3 / 4",
    overflow: "hidden",
    boxShadow:
      "0 28px 55px rgba(5,5,5,0.20)",
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

  coverLogo: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "62px",
    letterSpacing: "-4px",
    lineHeight: 0.85,
  },

  coverCenter: {
    textAlign: "center",
  },

  coverIssueLabel: {
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  coverNumber: {
    marginTop: "8px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "55px",
    lineHeight: 1,
  },

  coverBottom: {
    fontSize: "8px",
    lineHeight: 1.8,
    letterSpacing: "2.4px",
    fontWeight: 900,
  },

  openingContent: {
    maxWidth: "730px",
  },

  issueEyebrow: {
    color: COLORS.sapphire,
    fontSize: "9px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  issueTitle: {
    margin: "14px 0 15px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontWeight: 400,
    fontSize:
      "clamp(58px, 8vw, 110px)",
    lineHeight: 0.84,
    letterSpacing: "-4px",
  },

  issueDate: {
    textTransform: "uppercase",
    fontSize: "9px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  openingRule: {
    width: "100%",
    height: "1px",
    background: COLORS.line,
    margin: "25px 0",
  },

  issueDescription: {
    maxWidth: "650px",
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "19px",
    lineHeight: 1.65,
    color: "#35312D",
  },

  issueStats: {
    marginTop: "30px",
    paddingTop: "22px",
    borderTop:
      `1px solid ${COLORS.line}`,
    display: "flex",
    flexWrap: "wrap",
    gap: "35px",
  },

  statNumber: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "24px",
    color: COLORS.sapphire,
  },

  statLabel: {
    marginTop: "3px",
    fontSize: "7px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  primaryButton: {
    display: "inline-flex",
    marginTop: "28px",
    padding: "14px 22px",
    background: COLORS.sapphire,
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  /* ========================================
     EDITOR
  ======================================== */

  editorSection: {
    background: COLORS.black,
    color: COLORS.cream,
  },

  editorInner: {
    maxWidth: "980px",
    margin: "0 auto",
    padding: "65px 7%",
    textAlign: "center",
  },

  editorEyebrow: {
    color: COLORS.cream,
    fontSize: "8px",
    letterSpacing: "4px",
    fontWeight: 900,
  },

  editorQuote: {
    margin: "23px auto",
    border: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(30px, 4.5vw, 52px)",
    lineHeight: 1.12,
    fontStyle: "italic",
  },

  editorSignature: {
    color:
      "rgba(244,239,230,0.55)",
    fontSize: "7px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  /* ========================================
     CONTENTS
  ======================================== */

  contentsSection: {
    background: COLORS.cream,
  },

  contentsInner: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "68px 7%",
  },

  sectionTop: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-end",
    gap: "30px",
    paddingBottom: "18px",
    borderBottom:
      `1px solid ${COLORS.line}`,
    marginBottom: "28px",
  },

  sectionEyebrow: {
    color: COLORS.sapphire,
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
    marginBottom: "8px",
  },

  sectionTitle: {
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontWeight: 400,
    fontSize:
      "clamp(42px, 6vw, 68px)",
    lineHeight: 0.9,
  },

  sectionNumber: {
    color:
      "rgba(5,5,5,0.18)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "35px",
  },

  contentsList: {
    width: "100%",
  },

  contentsRow: {
    display: "grid",
    gridTemplateColumns:
      "60px minmax(0,1fr) 100px",
    gap: "20px",
    alignItems: "center",
    padding: "17px 0",
    borderBottom:
      `1px solid ${COLORS.line}`,
    color: COLORS.black,
    textDecoration: "none",
  },

  contentsNumber: {
    color: COLORS.sapphire,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "20px",
  },

  contentsLabel: {
    color: COLORS.sapphire,
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  contentsTitle: {
    marginTop: "4px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "22px",
    lineHeight: 1.05,
  },

  contentsArrow: {
    justifySelf: "end",
    fontSize: "7px",
    letterSpacing: "1.7px",
    fontWeight: 900,
  },

  /* EMPTY ISSUE */

  emptyIssue: {
    padding: "55px 0",
    textAlign: "center",
  },

  emptyIssueLabel: {
    color: COLORS.sapphire,
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  emptyIssueTitle: {
    margin: "15px 0 10px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(34px,5vw,54px)",
    fontWeight: 400,
    lineHeight: 1,
  },

  emptyIssueText: {
    maxWidth: "500px",
    margin: "0 auto",
    color: COLORS.muted,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "17px",
    lineHeight: 1.6,
  },

  /* ========================================
     COVER FEATURE
  ======================================== */

  featureSection: {
    background:
      COLORS.creamSoft,
  },

  featureGrid: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.3fr) minmax(0, 0.8fr)",
  },

  featureImage: {
    minHeight: "500px",
  },

  featureContent: {
    padding:
      "clamp(45px, 7vw, 90px)",
    borderLeft:
      `1px solid ${COLORS.line}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  featureNumber: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "26px",
    color:
      "rgba(5,5,5,0.18)",
    marginBottom: "16px",
  },

  storyCategory: {
    color: COLORS.sapphire,
    fontSize: "8px",
    letterSpacing: "2.4px",
    fontWeight: 900,
  },

  featureTitle: {
    margin: "12px 0 17px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(48px, 6vw, 80px)",
    lineHeight: 0.9,
    letterSpacing: "-2px",
    fontWeight: 400,
  },

  featureDescription: {
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "17px",
    lineHeight: 1.6,
    color: "#413C37",
  },

  storyButton: {
    alignSelf: "flex-start",
    marginTop: "25px",
    padding: "14px 21px",
    background: COLORS.sapphire,
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  /* ========================================
     STORY GRID
  ======================================== */

  storiesSection: {
    background: COLORS.cream,
  },

  storiesInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "70px 7% 80px",
  },

  storyGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0,1fr))",
    gap: "42px 25px",
  },

  storyCard: {
    borderTop:
      `4px solid ${COLORS.sapphire}`,
    paddingTop: "10px",
  },

  storyImage: {
    width: "100%",
    aspectRatio: "16 / 11",
    overflow: "hidden",
    marginBottom: "15px",
  },

  storyNumber: {
    color:
      "rgba(5,5,5,0.24)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "18px",
    marginBottom: "7px",
  },

  storyTitle: {
    margin: "9px 0 10px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontWeight: 400,
    fontSize: "28px",
    lineHeight: 1.02,
  },

  storyDescription: {
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "14px",
    lineHeight: 1.55,
    color: COLORS.muted,
  },

  storyTextLink: {
    display: "inline-block",
    marginTop: "15px",
    color: COLORS.sapphire,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "1.7px",
    fontWeight: 900,
  },
   /* ========================================
     ANI FEATURE
  ======================================== */

  aniSection: {
    background: COLORS.black,
    color: COLORS.cream,
  },

  aniGrid: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "75px 7%",
    display: "grid",
    gridTemplateColumns:
      "minmax(280px, 0.75fr) minmax(0, 1.25fr)",
    gap: "60px",
    alignItems: "center",
  },

  aniBrand: {
    borderRight:
      `1px solid ${COLORS.lightLine}`,
    paddingRight: "55px",
  },

  aniEyebrow: {
    color:
      "rgba(244,239,230,0.55)",
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
    marginBottom: "17px",
  },

  aniTitle: {
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(55px, 7vw, 92px)",
    lineHeight: 0.78,
    letterSpacing: "-3px",
    fontWeight: 400,
  },

  aniShort: {
    marginTop: "27px",
    color: COLORS.cream,
    fontSize: "9px",
    letterSpacing: "5px",
    fontWeight: 900,
  },

  aniStory: {
    maxWidth: "670px",
  },

  aniStoryNumber: {
    color:
      "rgba(244,239,230,0.25)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "26px",
  },

  aniStoryLabel: {
    marginTop: "13px",
    color: COLORS.cream,
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  aniStoryTitle: {
    margin: "13px 0 18px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontWeight: 400,
    fontSize:
      "clamp(43px, 6vw, 70px)",
    lineHeight: 0.94,
    letterSpacing: "-2px",
  },

  aniDescription: {
    margin: 0,
    maxWidth: "610px",
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
     END OF ISSUE
  ======================================== */

  endSection: {
    background:
      COLORS.creamSoft,
  },

  endInner: {
    maxWidth: "800px",
    margin: "0 auto",
    padding:
      "clamp(75px, 10vw, 125px) 7%",
    textAlign: "center",
  },

  endEyebrow: {
    color: COLORS.sapphire,
    fontSize: "8px",
    letterSpacing: "4px",
    fontWeight: 900,
  },

  endLogo: {
    marginTop: "18px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(78px, 12vw, 140px)",
    letterSpacing: "-7px",
    lineHeight: 0.8,
  },

  endText: {
    margin: "22px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "20px",
    fontStyle: "italic",
  },

  endRule: {
    width: "45px",
    height: "3px",
    margin: "27px auto",
    background: COLORS.sapphire,
  },

  returnButton: {
    display: "inline-flex",
    padding: "14px 22px",
    background: COLORS.black,
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  /* ========================================
     FOOTER
  ======================================== */

  footer: {
    background: COLORS.black,
    color: COLORS.cream,
    textAlign: "center",
    padding: "58px 7% 30px",
  },

  footerLogo: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "72px",
    lineHeight: 0.9,
    letterSpacing: "-4px",
  },

  footerBlueRule: {
    width: "40px",
    height: "3px",
    background: COLORS.sapphire,
    margin: "20px auto",
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
    marginTop: "29px",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
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

  /* ========================================
     SHARED IMAGE
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
    minHeight: "240px",
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

  imagePlaceholderLogo: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform:
      "translate(-50%, -50%)",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(65px, 10vw, 120px)",
    letterSpacing: "-6px",
    lineHeight: 1,
    userSelect: "none",
  },

  imagePlaceholderLabel: {
    position: "absolute",
    left: "20px",
    bottom: "18px",
    fontSize: "7px",
    letterSpacing: "2.5px",
    fontWeight: 900,
    textTransform: "uppercase",
  },

  /* ========================================
     NOT FOUND
  ======================================== */

  notFoundPage: {
    minHeight: "100vh",
    padding: "90px 7%",
    background: COLORS.cream,
    color: COLORS.black,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily:
      '"Helvetica Neue", Arial, sans-serif',
  },

  notFoundLogo: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "60px",
    letterSpacing: "-3px",
    lineHeight: 1,
  },

  notFoundRule: {
    width: "45px",
    height: "3px",
    margin: "22px auto",
    background: COLORS.sapphire,
  },

  notFoundLabel: {
    color: COLORS.sapphire,
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  notFoundTitle: {
    margin: "18px 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(55px, 9vw, 100px)",
    fontWeight: 400,
    lineHeight: 0.85,
    letterSpacing: "-4px",
  },

  notFoundText: {
    margin: "0 0 28px",
    color: COLORS.muted,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "17px",
    lineHeight: 1.6,
  },

  notFoundButton: {
    display: "inline-flex",
    padding: "14px 22px",
    background: COLORS.sapphire,
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "2px",
    fontWeight: 900,
  },
};

export default AsetIssuePage; 
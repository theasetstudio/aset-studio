import React, { useMemo } from "react";
import AsetEditorsLetterPage from "./AsetEditorsLetterPage";
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
  muted: "#625E58",
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
   ORIGINAL EDITORIAL ARTICLES

   These remain as the permanent fallback
   editorial copy for Issue 001.

   ASET Editorial Admin can override:
   title
   category
   excerpt
   author
   issue
   image
   body
   publication status

   If Admin body is blank, the original
   editorial body remains intact.
========================================== */

const articles = {
  "aset-begins-here": {
    category: "COVER STORY",
    title: "ASET Begins Here",

    dek:
      "A new editorial platform enters The Aset Studio ecosystem, created to spotlight entertainment, talent, culture, original stories, and the people shaping what comes next.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "ASET creates another place for entertainment, creativity, talent, and original ideas to live.",

    body: [
      "ASET begins as a new editorial door inside The Aset Studio, bringing entertainment, culture, creativity, and visual storytelling together in one publication.",

      "The magazine expands the studio's ability to publish stories in a format designed for reading, discovery, and conversation. Features can explore performers, entertainment, photography, beauty, culture, original productions, and the creative work happening throughout The Aset Studio ecosystem.",

      "Rather than functioning as a traditional magazine that exists only as a finished issue, ASET is being built as a living digital publication. Individual stories can stand on their own while also becoming part of curated magazine issues.",

      "That structure gives ASET room to grow. A feature can begin as an individual article, become part of an issue, connect with Aset Spotlight, or lead readers deeper into an original property created by The Aset Studio.",

      "The Premiere Issue marks the beginning of that editorial world.",
    ],
  },

  "people-behind-the-culture": {
    category: "ASET SPOTLIGHT",
    title:
      "The People Behind the Culture",

    dek:
      "ASET Spotlight expands into long-form editorial profiles and conversations with creatives, performers, and entertainment professionals.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "Entertainment is built by people whose ideas, performances, decisions, and creativity shape what audiences eventually see.",

    body: [
      "Behind every finished production is a much larger creative world. Performers, artists, producers, photographers, managers, designers, writers, and other entertainment professionals all contribute to the culture surrounding the work.",

      "Aset Spotlight was created to place those people at the center of the conversation. Inside ASET, that mission expands into longer editorial features that give readers more room to discover creative journeys, professional perspectives, and developing talent.",

      "These stories are not limited to the person standing in front of the camera. ASET Spotlight can explore the many creative and professional roles that help entertainment move from an idea into something audiences can experience.",

      "Through profiles, interviews, photography, and editorial storytelling, ASET will continue building a space where the people behind the culture can be seen.",
    ],
  },

  "television-worth-talking-about": {
    category: "FILM + TELEVISION",

    title:
      "What Makes Television Worth Talking About?",

    dek:
      "Characters, performances, storytelling, and the moments that keep audiences watching.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "The television that lasts beyond the credits usually gives audiences something worth discussing.",

    body: [
      "Television becomes part of culture when audiences carry the story with them after an episode ends.",

      "Sometimes the conversation begins with a performance. Sometimes it is a character decision, an unexpected development, a visual moment, or a relationship between characters that changes how viewers understand the story.",

      "ASET's Film + Television coverage looks at entertainment through that wider lens. The goal is not simply to recap what happened on screen, but to explore why particular performances, characters, and creative decisions become memorable.",

      "When television gives audiences something to debate, celebrate, question, or revisit, the story has moved beyond the screen and into conversation.",
    ],
  },

  "entertainment-beyond-the-screen": {
    category: "CULTURE",

    title:
      "Entertainment Is More Than the Screen",

    dek:
      "How style, conversation, fandom, music, and visual culture become part of the story.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "A story may begin on a screen, but culture determines how far it travels.",

    body: [
      "Entertainment rarely stays contained inside the production that introduced it.",

      "Audiences talk about characters, recreate looks, debate storylines, share reactions, discover music, build communities, and transform entertainment into something larger than the original release.",

      "That surrounding world is part of what ASET means by culture.",

      "The magazine's cultural coverage creates room to examine the conversations, aesthetics, fandom, photography, fashion, music, and creative responses that develop around entertainment.",

      "The screen may introduce the story. Culture gives it another life.",
    ],
  },

  "the-editorial-image": {
    category: "BEAUTY + STYLE",
    title: "The Editorial Image",

    dek:
      "Photography, beauty, fashion, and visual identity meet inside the world of ASET.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "An editorial image does more than show a subject. It establishes a world around them.",

    body: [
      "Photography has always played an important role in how entertainment and culture are presented.",

      "Wardrobe, beauty, lighting, composition, environment, and expression can completely change the story communicated by a photograph.",

      "Inside ASET, photography is not treated simply as decoration surrounding an article. The image can become part of the editorial language itself.",

      "Beauty and style coverage will explore that relationship between appearance, visual identity, photography, and storytelling while creating another bridge to The Aset Studio Photography Studio.",
    ],
  },

  "featured-creative": {
    category: "ASET SPOTLIGHT",
    title: "Featured Creative",

    dek:
      "A space for artists, performers, creators, and entertainment professionals whose work deserves a closer look.",

    author: "ASET Spotlight",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "Every creative career contains a story beyond the finished work.",

    body: [
      "ASET Spotlight features are designed to introduce readers to the people contributing to entertainment and creative culture.",

      "Each profile can explore the subject's work, creative perspective, professional journey, and the ideas shaping what they are building next.",

      "Future editions of this feature will introduce individual creatives through original editorial profiles and conversations.",
    ],
  },

  "industry-voice": {
    category: "ASET SPOTLIGHT",
    title: "Industry Voice",

    dek:
      "Perspectives from professionals working throughout entertainment and the creative industries.",

    author: "ASET Spotlight",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "Some of the most valuable entertainment conversations happen behind the finished product.",

    body: [
      "The entertainment industry includes an enormous range of professional perspectives.",

      "Industry Voice creates space inside ASET for conversations with people whose experience can illuminate how creative work develops, moves, and reaches audiences.",

      "Future features can include perspectives from managers, producers, photographers, executives, artists, and other entertainment professionals.",
    ],
  },

  "rising-talent": {
    category: "ASET SPOTLIGHT",
    title: "Rising Talent",

    dek:
      "A closer look at developing performers and storytellers building the next chapter of their creative careers.",

    author: "ASET Spotlight",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "The next important creative voice is often already building.",

    body: [
      "Rising Talent gives developing creatives room to be discovered before the rest of the industry catches up.",

      "The feature is designed for performers, storytellers, artists, and creators actively developing their work and professional identity.",

      "As ASET grows, these pages can become an ongoing record of talent encountered throughout The Aset Studio ecosystem.",
    ],
  },

  "performances-we-remember": {
    category: "FILM + TELEVISION",

    title:
      "The Performances We Remember",

    dek:
      "What turns an on-screen performance into something audiences continue thinking about?",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "A memorable performance can change the temperature of an entire story.",

    body: [
      "Some performances disappear when the credits roll. Others remain part of the conversation long after the story moves forward.",

      "Memorable performances are often built from more than dialogue. Expression, timing, chemistry, physical presence, silence, and emotional control can all shape how audiences understand a character.",

      "ASET examines performances as part of the larger craft of entertainment, looking at what makes certain characters and moments stay with viewers.",
    ],
  },

  "characters-that-take-over": {
    category: "COMMENTARY",

    title:
      "Characters That Take Over the Conversation",

    dek:
      "Sometimes one character becomes impossible for an audience to stop discussing.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "The most talked-about character is not always the character audiences expected to follow.",

    body: [
      "Every ensemble begins with a plan, but audiences have a habit of choosing their own favorites.",

      "A supporting character can suddenly become the center of online conversation because of a performance, personality, relationship, visual identity, or unexpected story development.",

      "Those audience reactions reveal something important about entertainment: viewers participate in determining which parts of a fictional world become culturally significant.",
    ],
  },

  "inside-modern-entertainment": {
    category: "INDUSTRY",
    title: "Inside Modern Entertainment",

    dek:
      "The boundaries between television, film, digital publishing, social media, and original creative platforms continue to shift.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "Modern entertainment no longer lives in only one format.",

    body: [
      "Entertainment audiences now move between screens, platforms, publications, social conversations, photography, and short-form media throughout the same day.",

      "That shift creates opportunities for independent entertainment companies to think differently about how stories and creative properties are developed.",

      "ASET itself is part of that approach, connecting editorial publishing with the wider entertainment ecosystem of The Aset Studio.",
    ],
  },

  "culture-behind-the-camera": {
    category: "CULTURE",
    title: "The Culture Behind the Camera",

    dek:
      "The creative worlds surrounding entertainment can become just as influential as what appears on screen.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "Entertainment creates images. Culture decides what those images become.",

    body: [
      "The world surrounding entertainment includes fashion, photography, fandom, language, music, visual trends, and conversation.",

      "These elements influence how audiences remember productions and how entertainment travels through culture.",

      "ASET Culture explores that larger environment, connecting what happens on screen with what happens around it.",
    ],
  },

  "entertainment-becomes-conversation": {
    category: "CULTURE",

    title:
      "When Entertainment Becomes Conversation",

    dek:
      "The moment audiences begin debating, sharing, reacting, and creating around a story, entertainment enters culture.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "Conversation is one of the places entertainment continues living.",

    body: [
      "A release is only the beginning of the relationship between entertainment and its audience.",

      "Discussion can extend a story far beyond its original running time. Reactions, commentary, fan communities, and creative responses all become part of the larger cultural footprint.",

      "ASET creates room for those conversations while keeping the focus on storytelling, performance, creativity, and entertainment.",
    ],
  },

  "beauty-as-storytelling": {
    category: "BEAUTY + STYLE",
    title: "Beauty as Storytelling",

    dek:
      "Beauty can establish character, atmosphere, era, status, and visual identity before a single word is spoken.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "Beauty becomes editorial when every visual decision contributes to the story.",

    body: [
      "Beauty within entertainment is often part of the storytelling language.",

      "Hair, makeup, grooming, wardrobe, texture, and color can help establish who a person is and what kind of world surrounds them.",

      "ASET Beauty + Style explores those choices from an editorial perspective, connecting visual presentation with photography and entertainment.",
    ],
  },

  "creating-editorial-look": {
    category: "BEAUTY + STYLE",

    title:
      "Creating the Editorial Look",

    dek:
      "A strong editorial image begins long before the shutter is pressed.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "The strongest editorial looks feel intentional from concept to final frame.",

    body: [
      "Editorial photography combines multiple creative decisions into one finished visual statement.",

      "Wardrobe, hair, makeup, lighting, posing, background, lens choice, and composition each contribute to the result.",

      "When those decisions share the same visual direction, a photograph begins to feel less like a simple portrait and more like a complete editorial world.",
    ],
  },

  "aset-photography-room": {
    category: "PHOTOGRAPHY",

    title:
      "Inside The Aset Studio Photography Room",

    dek:
      "Photography becomes another storytelling language inside The Aset Studio.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "Every portrait can become part of a larger visual story.",

    body: [
      "The Aset Studio Photography Studio creates a dedicated visual lane within the larger entertainment and media ecosystem.",

      "Its work can connect with ASET editorials, Aset Spotlight profiles, original entertainment properties, beauty concepts, and independent photography collections.",

      "Inside the magazine, those visual projects gain another home where imagery and editorial storytelling can exist together.",
    ],
  },

  "building-original-worlds": {
    category: "ASET ORIGINALS",
    title: "Building Original Worlds",

    dek:
      "A look inside the concepts, visual development, and entertainment properties being created by The Aset Studio.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",

    pullQuote:
      "An original world becomes believable through the accumulation of deliberate details.",

    body: [
      "Original entertainment properties require more than a central idea. Characters, environments, visual identity, relationships, production concepts, and continuity all contribute to the world audiences eventually experience.",

      "ASET Originals creates an editorial window into that development process.",

      "The section can explore visual development, creative concepts, production systems, photography, locations, and the wider process of constructing original entertainment inside The Aset Studio.",

      "As those properties grow, ASET can document their evolution from early development through future production.",
    ],
  },

  "inside-the-world-of-ani": {
    category:
      "AIN'T NOBODY INNOCENT",

    title: "Inside the World of ANI",

    dek:
      "Characters, locations, visual development, production concepts, and exclusive editorial material from The Aset Studio's original entertainment property.",

    author: "ASET Editorial",
    date: "September 2026",
    issue: "Issue 001",
    heroImage: "",
    theme: "dark",

    pullQuote:
      "ANI is being constructed as a world, not simply a single story.",

    body: [
      "Ain't Nobody Innocent, known as ANI, is an original entertainment property being developed inside The Aset Studio.",

      "Its development extends across characters, locations, visual canon, production concepts, worldbuilding systems, and the larger infrastructure needed to maintain continuity as the property grows.",

      "ASET provides ANI with an editorial space where selected parts of that development can be explored without turning the magazine into the story itself.",

      "Future ANI features can examine visual development, character design, locations, production concepts, and other parts of the franchise's expanding creative world.",
    ],
  },
};
/* ==========================================
   STORAGE HELPERS
========================================== */

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

/* ==========================================
   BODY NORMALIZER
========================================== */

function normalizeBody(body) {
  if (Array.isArray(body)) {
    return body
      .map((paragraph) =>
        String(paragraph).trim()
      )
      .filter(Boolean);
  }

  if (
    typeof body === "string" &&
    body.trim()
  ) {
    return body
      .split(/\n\s*\n/)
      .map((paragraph) =>
        paragraph.trim()
      )
      .filter(Boolean);
  }

  return [];
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
    /^issue-\d+$/.test(raw)
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

function getIssueRecord(
  issueValue
) {
  const number =
    normalizeIssueNumber(
      issueValue
    );

  if (!number) {
    return null;
  }

  const storedIssues =
    readLocalCollection(
      ISSUE_STORAGE_KEY
    );

  return (
    storedIssues.find(
      (issue) =>
        normalizeIssueNumber(
          issue.number ||
            issue.slug ||
            issue.title
        ) === number
    ) || null
  );
}

function buildIssueInfo(
  article
) {
  const issueValue =
    article?.issue ||
    "Unassigned";

  const number =
    normalizeIssueNumber(
      issueValue
    );

  /*
   * Article is not currently
   * assigned to an issue.
   */
  if (!number) {
    return {
      assigned: false,
      number: "",
      label: "Unassigned",
      title: "",
      slug: "",
      date: "",
    };
  }

  const issueRecord =
    getIssueRecord(
      issueValue
    );

  /*
   * If Admin contains the issue,
   * use its public metadata.
   */
  if (issueRecord) {
    return {
      assigned: true,

      number,

      label:
        `Issue ${number}`,

      title:
        issueRecord.title ||
        `Issue ${number}`,

      slug:
        issueRecord.slug ||
        `issue-${number}`,

      date:
        issueRecord.date ||
        "",
    };
  }

  /*
   * Issue 001 permanent fallback.
   */
  if (number === "001") {
    return {
      assigned: true,
      number: "001",
      label: "Issue 001",
      title:
        "The Premiere Issue",
      slug: "issue-001",
      date:
        "September 2026",
    };
  }

  /*
   * New issue exists on article
   * assignment but no issue metadata
   * is available yet.
   */
  return {
    assigned: true,
    number,
    label:
      `Issue ${number}`,
    title:
      `Issue ${number}`,
    slug:
      `issue-${number}`,
    date: "",
  };
}

/* ==========================================
   CATEGORY HELPERS
========================================== */

function normalizeCategory(
  value = ""
) {
  const category =
    String(value)
      .trim()
      .toUpperCase();

  if (
    category === "ANI"
  ) {
    return "AIN'T NOBODY INNOCENT";
  }

  return (
    category ||
    "ASET EDITORIAL"
  );
}

function isDarkCategory(
  category
) {
  const normalized =
    normalizeCategory(
      category
    );

  return (
    normalized ===
      "AIN'T NOBODY INNOCENT" ||
    normalized === "ANI"
  );
}

/* ==========================================
   ADMIN ARTICLE LOOKUP
========================================== */

function getAdminArticles() {
  return readLocalCollection(
    ARTICLE_STORAGE_KEY
  );
}

function getAdminArticle(
  slug
) {
  return (
    getAdminArticles().find(
      (item) =>
        item.slug === slug
    ) || null
  );
}

/* ==========================================
   BUILD PUBLIC ARTICLE
========================================== */

function buildArticle(slug) {
  const baseArticle =
    articles[slug] || null;

  const adminArticle =
    getAdminArticle(slug);

  /*
   * No Admin record.
   *
   * Original editorial article
   * remains publicly available.
   */
  if (!adminArticle) {
    if (!baseArticle) {
      return null;
    }

    return {
      ...baseArticle,

      category:
        normalizeCategory(
          baseArticle.category
        ),

      body:
        normalizeBody(
          baseArticle.body
        ),

      issueInfo:
        buildIssueInfo(
          baseArticle
        ),
    };
  }

  /*
   * Admin publication status
   * controls the public article.
   *
   * Draft articles disappear
   * from the public magazine.
   */
  if (
    adminArticle.status !==
    "Published"
  ) {
    return null;
  }

  const adminBody =
    normalizeBody(
      adminArticle.body
    );

  /*
   * ========================================
   * BRAND-NEW ADMIN ARTICLE
   * ========================================
   */

  if (!baseArticle) {
    const newArticle = {
      category:
        normalizeCategory(
          adminArticle.category
        ),

      title:
        adminArticle.title?.trim() ||
        "Untitled Story",

      dek:
        adminArticle.excerpt?.trim() ||
        "",

      author:
        adminArticle.author?.trim() ||
        "ASET Editorial",

      date:
        adminArticle.updated?.trim() ||
        "September 2026",

      issue:
        adminArticle.issue ||
        "Unassigned",

      heroImage:
        adminArticle.image?.trim() ||
        "",

      pullQuote:
        adminArticle.pullQuote?.trim() ||
        "",

      body:
        adminBody,

      theme:
        isDarkCategory(
          adminArticle.category
        )
          ? "dark"
          : undefined,

      featured:
        Boolean(
          adminArticle.featured
        ),

      coverStory:
        Boolean(
          adminArticle.coverStory
        ),
    };

    return {
      ...newArticle,

      issueInfo:
        buildIssueInfo(
          newArticle
        ),
    };
  }

  /*
   * ========================================
   * EXISTING EDITORIAL ARTICLE
   * ========================================
   *
   * Admin controls the metadata.
   *
   * Blank Admin body does NOT erase
   * the original editorial body.
   *
   * Blank Admin image does NOT erase
   * an existing editorial image.
   * ========================================
   */

  const mergedArticle = {
    ...baseArticle,

    category:
      normalizeCategory(
        adminArticle.category ||
          baseArticle.category
      ),

    title:
      adminArticle.title?.trim() ||
      baseArticle.title,

    dek:
      adminArticle.excerpt?.trim()
        ? adminArticle.excerpt
        : baseArticle.dek,

    author:
      adminArticle.author?.trim() ||
      baseArticle.author,

    /*
     * Admin's updated date is now
     * allowed to control the public
     * published date when available.
     */
    date:
      adminArticle.updated?.trim() ||
      baseArticle.date,

    issue:
      adminArticle.issue ||
      baseArticle.issue,

    heroImage:
      adminArticle.image?.trim()
        ? adminArticle.image
        : baseArticle.heroImage,

    body:
      adminBody.length > 0
        ? adminBody
        : normalizeBody(
            baseArticle.body
          ),

    pullQuote:
      adminArticle.pullQuote?.trim()
        ? adminArticle.pullQuote
        : baseArticle.pullQuote ||
          "",

    theme:
      isDarkCategory(
        adminArticle.category ||
          baseArticle.category
      )
        ? "dark"
        : baseArticle.theme,

    featured:
      Boolean(
        adminArticle.featured
      ),

    coverStory:
      Boolean(
        adminArticle.coverStory
      ),
  };

  return {
    ...mergedArticle,

    issueInfo:
      buildIssueInfo(
        mergedArticle
      ),
  };
}

/* ==========================================
   RELATED STORY BUILDER
========================================== */

function buildRelatedStories(
  currentSlug,
  currentArticle
) {
  const storedArticles =
    getAdminArticles();

  const publishedAdmin =
    storedArticles.filter(
      (article) =>
        article.status ===
          "Published" &&
        article.slug !==
          currentSlug
    );

  /*
   * Start with published Admin
   * stories so newly created stories
   * can enter Keep Reading.
   */
  const storyMap =
    new Map();

  publishedAdmin.forEach(
    (article) => {
      storyMap.set(
        article.slug,
        {
          category:
            normalizeCategory(
              article.category
            ),

          title:
            article.title ||
            "Untitled Story",

          slug:
            article.slug,

          image:
            article.image || "",

          issue:
            article.issue ||
            "Unassigned",
        }
      );
    }
  );

  /*
   * Add original editorial stories
   * only when Admin has not already
   * supplied that slug.
   *
   * If Admin explicitly made a
   * fallback article Draft, do not
   * sneak it back into Keep Reading.
   */
  Object.entries(
    articles
  ).forEach(
    ([storySlug, story]) => {
      if (
        storySlug ===
        currentSlug
      ) {
        return;
      }

      const adminOverride =
        storedArticles.find(
          (item) =>
            item.slug ===
            storySlug
        );

      if (
        adminOverride &&
        adminOverride.status !==
          "Published"
      ) {
        return;
      }

      if (
        !storyMap.has(
          storySlug
        )
      ) {
        storyMap.set(
          storySlug,
          {
            category:
              normalizeCategory(
                story.category
              ),

            title:
              story.title,

            slug:
              storySlug,

            image:
              story.heroImage ||
              "",

            issue:
              story.issue ||
              "Issue 001",
          }
        );
      }
    }
  );

  const stories =
    Array.from(
      storyMap.values()
    );

  /*
   * Prefer stories from the same
   * issue as the article currently
   * being read.
   */
  const currentIssueNumber =
    normalizeIssueNumber(
      currentArticle?.issue
    );

  stories.sort(
    (a, b) => {
      const aSameIssue =
        normalizeIssueNumber(
          a.issue
        ) ===
        currentIssueNumber;

      const bSameIssue =
        normalizeIssueNumber(
          b.issue
        ) ===
        currentIssueNumber;

      if (
        aSameIssue &&
        !bSameIssue
      ) {
        return -1;
      }

      if (
        !aSameIssue &&
        bSameIssue
      ) {
        return 1;
      }

      return 0;
    }
  );

  return stories.slice(
    0,
    3
  );
}

/* ==========================================
   ARTICLE PAGE
========================================== */

function AsetArticlePage() {
  const { slug } =
    useParams();

  /*
   * THIS is the critical fix.
   *
   * The old page created buildArticle()
   * but then bypassed it by reading:
   *
   * const article = articles[slug];
   *
   * The public page now actually
   * reads through the Admin bridge.
   */
  const article =
    useMemo(
      () =>
        buildArticle(slug),
      [slug]
    );

      /* ==========================================
     SPECIAL EDITORIAL LAYOUTS
  ========================================== */

  if (
    slug ===
    "we-didnt-wait-for-permission"
  ) {
    return (
      <AsetEditorsLetterPage />
    );
  }

  if (!article) {
    return (
      <StoryComingSoon />
    );
  }

  const issueInfo =
    article.issueInfo ||
    buildIssueInfo(
      article
    );

  const relatedStories =
    buildRelatedStories(
      slug,
      article
    );

  const isDark =
    article.theme ===
    "dark";

  const issueRoute =
    issueInfo.assigned
      ? `/aset/issues/${issueInfo.slug}`
      : "/aset";

  const issueTopLabel =
    issueInfo.assigned
      ? `ISSUE ${issueInfo.number}`
      : "ASET";

  const sidebarIssueTitle =
    issueInfo.title ||
    "ASET";

  const sidebarIssueNumber =
    issueInfo.assigned
      ? `NO. ${issueInfo.number}`
      : "DIGITAL EDITORIAL";

  return (
    <main
      style={{
        ...styles.page,

        background: isDark
          ? COLORS.black
          : COLORS.cream,

        color: isDark
          ? COLORS.cream
          : COLORS.black,
      }}
    >
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          .aset-article-link {
            transition:
              opacity 160ms ease,
              transform 160ms ease;
          }

          .aset-article-link:hover {
            opacity: 0.68;
          }

          .aset-related-card {
            transition:
              transform 180ms ease;
          }

          .aset-related-card:hover {
            transform: translateY(-3px);
          }

          @media (max-width: 850px) {
            .aset-article-header-grid {
              grid-template-columns:
                1fr !important;
            }

            .aset-article-meta {
              border-left:
                0 !important;

              border-top:
                1px solid
                rgba(
                  5,
                  5,
                  5,
                  0.15
                );

              padding-left:
                0 !important;

              padding-top:
                22px !important;
            }

            .aset-article-body-grid {
              grid-template-columns:
                1fr !important;
            }

            .aset-article-sidebar {
              display:
                none !important;
            }

            .aset-related-grid {
              grid-template-columns:
                1fr !important;
            }
          }

          @media (max-width: 600px) {
            .aset-article-wrap {
              padding-left:
                6% !important;

              padding-right:
                6% !important;
            }

            .aset-article-masthead {
              font-size:
                50px !important;
            }
          }
        `}
      </style>
            {/* =====================================
          ARTICLE MAGAZINE BAR
      ===================================== */}

      <header
        style={{
          ...styles.magazineBar,

          borderBottomColor:
            isDark
              ? COLORS.lightLine
              : COLORS.line,
        }}
      >
        <div
          className="aset-article-wrap"
          style={
            styles.magazineBarInner
          }
        >
          <Link
            to="/aset"
            className="aset-article-link"
            style={{
              ...styles.backLink,

              color: isDark
                ? COLORS.cream
                : COLORS.black,
            }}
          >
            ← ASET MAGAZINE
          </Link>

          <Link
            to="/aset"
            className="aset-article-link"
            style={{
              ...styles.articleMasthead,

              color: isDark
                ? COLORS.cream
                : COLORS.black,
            }}
          >
            ASET
          </Link>

          <Link
            to={issueRoute}
            className="aset-article-link"
            style={{
              ...styles.issueTopLink,

              color: isDark
                ? COLORS.cream
                : COLORS.sapphire,
            }}
          >
            {issueTopLabel}
          </Link>
        </div>
      </header>

      {/* =====================================
          ARTICLE HEADER
      ===================================== */}

      <section
        style={{
          ...styles.articleHeader,

          background: isDark
            ? COLORS.black
            : COLORS.cream,
        }}
      >
        <div
          className="aset-article-wrap"
          style={
            styles.articleHeaderInner
          }
        >
          <div
            style={{
              ...styles.articleCategory,

              color: isDark
                ? COLORS.cream
                : COLORS.sapphire,
            }}
          >
            {article.category}
          </div>

          <div
            className="aset-article-header-grid"
            style={
              styles.articleHeaderGrid
            }
          >
            <div>
              <h1
                style={{
                  ...styles.articleTitle,

                  color: isDark
                    ? COLORS.cream
                    : COLORS.black,
                }}
              >
                {article.title}
              </h1>

              {article.dek ? (
                <p
                  style={{
                    ...styles.articleDek,

                    color: isDark
                      ? "rgba(244,239,230,0.72)"
                      : COLORS.muted,
                  }}
                >
                  {article.dek}
                </p>
              ) : null}
            </div>

            <aside
              className="aset-article-meta"
              style={{
                ...styles.articleMeta,

                borderLeftColor:
                  isDark
                    ? COLORS.lightLine
                    : COLORS.line,
              }}
            >
              <div
                style={
                  styles.metaBlock
                }
              >
                <div
                  style={{
                    ...styles.metaLabel,

                    color: isDark
                      ? "rgba(244,239,230,0.48)"
                      : COLORS.muted,
                  }}
                >
                  WRITTEN BY
                </div>

                <div
                  style={{
                    ...styles.metaValue,

                    color: isDark
                      ? COLORS.cream
                      : COLORS.black,
                  }}
                >
                  {article.author}
                </div>
              </div>

              <div
                style={
                  styles.metaBlock
                }
              >
                <div
                  style={{
                    ...styles.metaLabel,

                    color: isDark
                      ? "rgba(244,239,230,0.48)"
                      : COLORS.muted,
                  }}
                >
                  PUBLISHED
                </div>

                <div
                  style={{
                    ...styles.metaValue,

                    color: isDark
                      ? COLORS.cream
                      : COLORS.black,
                  }}
                >
                  {article.date}
                </div>
              </div>

              <div
                style={
                  styles.metaBlock
                }
              >
                <div
                  style={{
                    ...styles.metaLabel,

                    color: isDark
                      ? "rgba(244,239,230,0.48)"
                      : COLORS.muted,
                  }}
                >
                  EDITION
                </div>

                <div
                  style={{
                    ...styles.metaValue,

                    color: isDark
                      ? COLORS.cream
                      : COLORS.black,
                  }}
                >
                  {issueInfo.assigned
                    ? issueInfo.label
                    : "Digital Editorial"}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================
          HERO IMAGE
      ===================================== */}

      <section
        style={{
          ...styles.heroSection,

          background: isDark
            ? COLORS.black
            : COLORS.cream,
        }}
      >
        <div
          className="aset-article-wrap"
          style={
            styles.heroInner
          }
        >
          <div
            style={{
              ...styles.heroFrame,

              background: isDark
                ? COLORS.softBlack
                : COLORS.creamSoft,
            }}
          >
            {article.heroImage ? (
              <img
                src={
                  article.heroImage
                }
                alt={article.title}
                style={
                  styles.heroImage
                }
              />
            ) : (
              <ArticleImagePlaceholder
                dark={isDark}
                category={
                  article.category
                }
              />
            )}
          </div>
        </div>
      </section>

      {/* =====================================
          ARTICLE BODY
      ===================================== */}

      <section
        style={{
          ...styles.bodySection,

          background: isDark
            ? COLORS.black
            : COLORS.cream,
        }}
      >
        <div
          className="aset-article-wrap aset-article-body-grid"
          style={
            styles.bodyGrid
          }
        >
          {/* SIDEBAR */}

          <aside
            className="aset-article-sidebar"
            style={{
              ...styles.sidebar,

              borderTopColor:
                isDark
                  ? COLORS.lightLine
                  : COLORS.line,
            }}
          >
            <div
              style={{
                ...styles.sidebarLabel,

                color: isDark
                  ? "rgba(244,239,230,0.48)"
                  : COLORS.muted,
              }}
            >
              IN THIS EDITION
            </div>

            {issueInfo.assigned ? (
              <Link
                to={issueRoute}
                className="aset-article-link"
                style={{
                  ...styles.sidebarIssueLink,

                  color: isDark
                    ? COLORS.cream
                    : COLORS.black,
                }}
              >
                {sidebarIssueTitle}
                <span
                  style={{
                    ...styles.sidebarIssueNumber,

                    color: isDark
                      ? "rgba(244,239,230,0.48)"
                      : COLORS.muted,
                  }}
                >
                  {sidebarIssueNumber}
                </span>
              </Link>
            ) : (
              <div
                style={{
                  ...styles.sidebarIssueLink,

                  color: isDark
                    ? COLORS.cream
                    : COLORS.black,
                }}
              >
                ASET DIGITAL
                <span
                  style={{
                    ...styles.sidebarIssueNumber,

                    color: isDark
                      ? "rgba(244,239,230,0.48)"
                      : COLORS.muted,
                  }}
                >
                  DIGITAL EDITORIAL
                </span>
              </div>
            )}

            <div
              style={{
                ...styles.sidebarDivider,

                background: isDark
                  ? COLORS.lightLine
                  : COLORS.line,
              }}
            />

            <Link
              to="/aset"
              className="aset-article-link"
              style={{
                ...styles.sidebarSmallLink,

                color: isDark
                  ? COLORS.cream
                  : COLORS.sapphire,
              }}
            >
              BACK TO ASET →
            </Link>
          </aside>

          {/* STORY */}

          <article
            style={
              styles.articleBody
            }
          >
            {article.body.length >
            0 ? (
              article.body.map(
                (
                  paragraph,
                  index
                ) => (
                  <React.Fragment
                    key={index}
                  >
                    <p
                      style={{
                        ...styles.bodyParagraph,

                        color: isDark
                          ? "rgba(244,239,230,0.88)"
                          : COLORS.black,
                      }}
                    >
                      {paragraph}
                    </p>

                    {index === 1 &&
                    article.pullQuote ? (
                      <blockquote
                        style={{
                          ...styles.pullQuote,

                          color: isDark
                            ? COLORS.cream
                            : COLORS.sapphire,

                          borderTopColor:
                            isDark
                              ? COLORS.lightLine
                              : COLORS.sapphire,

                          borderBottomColor:
                            isDark
                              ? COLORS.lightLine
                              : COLORS.sapphire,
                        }}
                      >
                        “
                        {
                          article.pullQuote
                        }
                        ”
                      </blockquote>
                    ) : null}
                  </React.Fragment>
                )
              )
            ) : (
              <p
                style={{
                  ...styles.bodyParagraph,

                  color: isDark
                    ? "rgba(244,239,230,0.72)"
                    : COLORS.muted,
                }}
              >
                This ASET story has
                been published and its
                full editorial body is
                being prepared.
              </p>
            )}

            <div
              style={{
                ...styles.articleEndMark,

                color: isDark
                  ? COLORS.cream
                  : COLORS.sapphire,
              }}
            >
              ◆
            </div>
          </article>

          {/* RIGHT RAIL */}

          <aside
            style={{
              ...styles.rightRail,

              borderTopColor:
                isDark
                  ? COLORS.lightLine
                  : COLORS.line,
            }}
          >
            <div
              style={{
                ...styles.rightRailLabel,

                color: isDark
                  ? "rgba(244,239,230,0.48)"
                  : COLORS.muted,
              }}
            >
              ASET
            </div>

            <div
              style={{
                ...styles.rightRailText,

                color: isDark
                  ? COLORS.cream
                  : COLORS.black,
              }}
            >
              ENTERTAINMENT
              <br />
              CULTURE
              <br />
              CREATIVITY
            </div>

            <div
              style={{
                ...styles.rightRailRule,

                background: isDark
                  ? COLORS.lightLine
                  : COLORS.line,
              }}
            />

            <div
              style={{
                ...styles.rightRailSmall,

                color: isDark
                  ? "rgba(244,239,230,0.48)"
                  : COLORS.muted,
              }}
            >
              A publication by
              <br />
              The Aset Studio
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================
          KEEP READING
      ===================================== */}

      {relatedStories.length >
      0 ? (
        <section
          style={{
            ...styles.relatedSection,

            background: isDark
              ? COLORS.softBlack
              : COLORS.creamSoft,

            borderTopColor:
              isDark
                ? COLORS.lightLine
                : COLORS.line,
          }}
        >
          <div
            className="aset-article-wrap"
            style={
              styles.relatedInner
            }
          >
            <div
              style={
                styles.relatedHeader
              }
            >
              <div>
                <div
                  style={{
                    ...styles.relatedEyebrow,

                    color: isDark
                      ? COLORS.cream
                      : COLORS.sapphire,
                  }}
                >
                  CONTINUE READING
                </div>

                <h2
                  style={{
                    ...styles.relatedTitle,

                    color: isDark
                      ? COLORS.cream
                      : COLORS.black,
                  }}
                >
                  Keep Reading
                </h2>
              </div>

              <Link
                to="/aset"
                className="aset-article-link"
                style={{
                  ...styles.viewAllLink,

                  color: isDark
                    ? COLORS.cream
                    : COLORS.black,
                }}
              >
                VIEW ASET →
              </Link>
            </div>

            <div
              className="aset-related-grid"
              style={
                styles.relatedGrid
              }
            >
              {relatedStories.map(
                (story) => (
                  <Link
                    key={story.slug}
                    to={`/aset/articles/${story.slug}`}
                    className="aset-related-card"
                    style={{
                      ...styles.relatedCard,

                      color: isDark
                        ? COLORS.cream
                        : COLORS.black,

                      borderTopColor:
                        isDark
                          ? COLORS.lightLine
                          : COLORS.line,
                    }}
                  >
                    <div
                      style={
                        styles.relatedImage
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
                            styles.relatedImageActual
                          }
                        />
                      ) : (
                        <ArticleImagePlaceholder
                          compact
                          dark={
                            isDark
                          }
                          category={
                            story.category
                          }
                        />
                      )}
                    </div>

                    <div
                      style={{
                        ...styles.relatedCategory,

                        color: isDark
                          ? COLORS.cream
                          : COLORS.sapphire,
                      }}
                    >
                      {
                        story.category
                      }
                    </div>

                    <h3
                      style={
                        styles.relatedStoryTitle
                      }
                    >
                      {story.title}
                    </h3>

                    <div
                      style={{
                        ...styles.relatedRead,

                        color: isDark
                          ? "rgba(244,239,230,0.58)"
                          : COLORS.muted,
                      }}
                    >
                      READ STORY →
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* =====================================
          ARTICLE FOOTER
      ===================================== */}

      <footer
        style={
          styles.footer
        }
      >
        <div
          className="aset-article-wrap"
          style={
            styles.footerInner
          }
        >
          <div
            style={
              styles.footerMasthead
            }
          >
            ASET
          </div>

          <div
            style={
              styles.footerRule
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
              to="/aset"
              className="aset-article-link"
              style={
                styles.footerLink
              }
            >
              ASET MAGAZINE
            </Link>

            {issueInfo.assigned ? (
              <Link
                to={issueRoute}
                className="aset-article-link"
                style={
                  styles.footerLink
                }
              >
                ISSUE{" "}
                {issueInfo.number}
              </Link>
            ) : null}

            <Link
              to="/aset-spotlight"
              className="aset-article-link"
              style={
                styles.footerLink
              }
            >
              ASET SPOTLIGHT
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
   ARTICLE IMAGE PLACEHOLDER
========================================== */

function ArticleImagePlaceholder({
  category,
  dark = false,
  compact = false,
}) {
  return (
    <div
      style={{
        ...styles.placeholder,

        minHeight: compact
          ? "180px"
          : "420px",

        background: dark
          ? `linear-gradient(
              145deg,
              ${COLORS.softBlack},
              ${COLORS.black}
            )`
          : `linear-gradient(
              145deg,
              #DED7CC,
              ${COLORS.cream}
            )`,
      }}
    >
      <div
        style={{
          ...styles.placeholderWord,

          color: dark
            ? "rgba(244,239,230,0.16)"
            : "rgba(5,5,5,0.16)",

          fontSize: compact
            ? "28px"
            : "clamp(42px, 7vw, 88px)",
        }}
      >
        {category ||
          "ASET"}
      </div>
    </div>
  );
}

/* ==========================================
   STORY COMING SOON / NOT PUBLIC
========================================== */

function StoryComingSoon() {
  return (
    <main
      style={
        styles.notFoundPage
      }
    >
      <div
        style={
          styles.notFoundInner
        }
      >
        <Link
          to="/aset"
          style={
            styles.notFoundLogo
          }
        >
          ASET
        </Link>

        <div
          style={
            styles.notFoundRule
          }
        />

        <div
          style={
            styles.notFoundKicker
          }
        >
          ASET EDITORIAL
        </div>

        <h1
          style={
            styles.notFoundTitle
          }
        >
          Story Coming Soon
        </h1>

        <p
          style={
            styles.notFoundText
          }
        >
          This story is not currently
          available in the public
          edition of ASET.
        </p>

        <Link
          to="/aset"
          style={
            styles.notFoundButton
          }
        >
          RETURN TO ASET
        </Link>
      </div>
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
    fontFamily:
      '"Helvetica Neue", Arial, sans-serif',
  },

  /* ========================================
     MAGAZINE BAR
  ======================================== */

  magazineBar: {
    borderBottom: "1px solid",
  },

  magazineBarInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "18px 7%",
    display: "grid",
    gridTemplateColumns:
      "1fr auto 1fr",
    alignItems: "center",
    gap: "20px",
  },

  backLink: {
    justifySelf: "start",
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  articleMasthead: {
    justifySelf: "center",
    color: COLORS.black,
    textDecoration: "none",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "58px",
    lineHeight: 0.8,
    letterSpacing: "-4px",
  },

  issueTopLink: {
    justifySelf: "end",
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  /* ========================================
     ARTICLE HEADER
  ======================================== */

  articleHeader: {
    paddingTop: "55px",
  },

  articleHeaderInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 7% 55px",
  },

  articleCategory: {
    marginBottom: "18px",
    fontSize: "8px",
    letterSpacing: "3px",
    fontWeight: 900,
    textTransform: "uppercase",
  },

  articleHeaderGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) 220px",
    gap: "55px",
    alignItems: "end",
  },

  articleTitle: {
    maxWidth: "1050px",
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(58px, 9vw, 126px)",
    fontWeight: 400,
    lineHeight: 0.82,
    letterSpacing: "-5px",
  },

  articleDek: {
    maxWidth: "850px",
    margin: "27px 0 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(18px, 2vw, 24px)",
    lineHeight: 1.5,
  },

  articleMeta: {
    paddingLeft: "24px",
    borderLeft: "1px solid",
  },

  metaBlock: {
    marginBottom: "18px",
  },

  metaLabel: {
    marginBottom: "5px",
    fontSize: "6px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  metaValue: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "14px",
    lineHeight: 1.35,
  },

  /* ========================================
     HERO
  ======================================== */

  heroSection: {
    paddingBottom: "50px",
  },

  heroInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 7%",
  },

  heroFrame: {
    width: "100%",
    aspectRatio: "16 / 8",
    overflow: "hidden",
  },

  heroImage: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  /* ========================================
     ARTICLE BODY
  ======================================== */

  bodySection: {
    paddingBottom: "80px",
  },

  bodyGrid: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "20px 7% 0",
    display: "grid",
    gridTemplateColumns:
      "170px minmax(0, 650px) 150px",
    gap: "45px",
    justifyContent: "center",
    alignItems: "start",
  },

  sidebar: {
    position: "sticky",
    top: "30px",
    paddingTop: "17px",
    borderTop: "1px solid",
  },

  sidebarLabel: {
    marginBottom: "12px",
    fontSize: "6px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  sidebarIssueLink: {
    display: "block",
    textDecoration: "none",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "20px",
    lineHeight: 1.05,
  },

  sidebarIssueNumber: {
    display: "block",
    marginTop: "7px",
    fontFamily:
      '"Helvetica Neue", Arial, sans-serif',
    fontSize: "6px",
    letterSpacing: "1.7px",
    fontWeight: 900,
  },

  sidebarDivider: {
    width: "100%",
    height: "1px",
    margin: "18px 0",
  },

  sidebarSmallLink: {
    textDecoration: "none",
    fontSize: "6px",
    letterSpacing: "1.5px",
    fontWeight: 900,
  },

  articleBody: {
    minWidth: 0,
  },

  bodyParagraph: {
    margin: "0 0 25px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(18px, 2vw, 21px)",
    lineHeight: 1.75,
  },

  pullQuote: {
    margin: "45px 0",
    padding: "30px 0",
    borderTop: "2px solid",
    borderBottom: "1px solid",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(30px, 4vw, 46px)",
    fontWeight: 400,
    fontStyle: "italic",
    lineHeight: 1.12,
  },

  articleEndMark: {
    marginTop: "45px",
    textAlign: "center",
    fontSize: "15px",
  },

  /* ========================================
     RIGHT RAIL
  ======================================== */

  rightRail: {
    position: "sticky",
    top: "30px",
    paddingTop: "17px",
    borderTop: "1px solid",
  },

  rightRailLabel: {
    marginBottom: "12px",
    fontSize: "6px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  rightRailText: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "17px",
    lineHeight: 1.3,
  },

  rightRailRule: {
    width: "30px",
    height: "2px",
    margin: "17px 0",
  },

  rightRailSmall: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "11px",
    fontStyle: "italic",
    lineHeight: 1.5,
  },

  /* ========================================
     RELATED STORIES
  ======================================== */

  relatedSection: {
    borderTop: "1px solid",
  },

  relatedInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "65px 7%",
  },

  relatedHeader: {
    marginBottom: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "25px",
  },

  relatedEyebrow: {
    marginBottom: "7px",
    fontSize: "7px",
    letterSpacing: "2.5px",
    fontWeight: 900,
  },

  relatedTitle: {
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(40px, 5vw, 64px)",
    fontWeight: 400,
    lineHeight: 0.9,
    letterSpacing: "-2px",
  },

  viewAllLink: {
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.7px",
    fontWeight: 900,
  },

  relatedGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "25px",
  },

  relatedCard: {
    display: "block",
    paddingTop: "15px",
    borderTop: "3px solid",
    textDecoration: "none",
  },

  relatedImage: {
    width: "100%",
    aspectRatio: "16 / 10",
    overflow: "hidden",
    marginBottom: "15px",
  },

  relatedImageActual: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  relatedCategory: {
    marginBottom: "8px",
    fontSize: "7px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  relatedStoryTitle: {
    margin: 0,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "26px",
    fontWeight: 400,
    lineHeight: 1,
  },

  relatedRead: {
    marginTop: "14px",
    fontSize: "6px",
    letterSpacing: "1.5px",
    fontWeight: 900,
  },

  /* ========================================
     PLACEHOLDER
  ======================================== */

  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  placeholderWord: {
    padding: "25px",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontWeight: 400,
    lineHeight: 0.9,
    letterSpacing: "-2px",
    textAlign: "center",
    textTransform: "uppercase",
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

  footerMasthead: {
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "75px",
    letterSpacing: "-4px",
    lineHeight: 0.85,
  },

  footerRule: {
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

  /* ========================================
     NOT FOUND / DRAFT
  ======================================== */

  notFoundPage: {
    minHeight: "100vh",
    padding: "80px 7%",
    background: COLORS.cream,
    color: COLORS.black,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      '"Helvetica Neue", Arial, sans-serif',
  },

  notFoundInner: {
    width: "100%",
    maxWidth: "720px",
    textAlign: "center",
  },

  notFoundLogo: {
    display: "inline-block",
    color: COLORS.black,
    textDecoration: "none",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "80px",
    letterSpacing: "-5px",
    lineHeight: 0.8,
  },

  notFoundRule: {
    width: "42px",
    height: "3px",
    margin: "25px auto",
    background: COLORS.sapphire,
  },

  notFoundKicker: {
    color: COLORS.sapphire,
    fontSize: "7px",
    letterSpacing: "3px",
    fontWeight: 900,
  },

  notFoundTitle: {
    margin: "15px 0",
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize:
      "clamp(48px, 8vw, 85px)",
    fontWeight: 400,
    lineHeight: 0.9,
    letterSpacing: "-3px",
  },

  notFoundText: {
    maxWidth: "500px",
    margin: "0 auto",
    color: COLORS.muted,
    fontFamily:
      '"Times New Roman", Georgia, serif',
    fontSize: "17px",
    lineHeight: 1.6,
  },

  notFoundButton: {
    display: "inline-flex",
    marginTop: "28px",
    padding: "14px 22px",
    background: COLORS.sapphire,
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
  },
};

export default AsetArticlePage;
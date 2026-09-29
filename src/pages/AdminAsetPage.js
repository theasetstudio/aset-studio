import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* =========================================================
   ASET MAGAZINE ADMIN
   Local editorial command center

   CURRENT:
   - React front end
   - localStorage persistence

   LATER:
   - Supabase persistence
   - magazine_articles
   - magazine_issues
   - magazine_categories
   - magazine_contributors
   - magazine_article_images
========================================================= */

const COLORS = {
  sapphire: "#042D70",
  sapphireDeep: "#031F4D",
  cream: "#F4EFE6",
  creamSoft: "#EEE7DC",
  black: "#050505",
  softBlack: "#141414",
  muted: "#6E6A64",
  line: "rgba(5,5,5,0.14)",
  lightLine: "rgba(244,239,230,0.16)",
  green: "#28633C",
  amber: "#8A5B12",
  red: "#8B2E2E",
};

const STORAGE = {
  articles: "aset_magazine_articles",
  issues: "aset_magazine_issues",
  categories: "aset_magazine_categories",
  contributors: "aset_magazine_contributors",
  submissions: "aset_magazine_submissions",
};

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultArticles = [
  {
    id: 1,
    title: "ASET Begins Here",
    slug: "aset-begins-here",
    category: "Cover Story",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: true,
    coverStory: true,
    excerpt:
      "A new editorial platform enters The Aset Studio ecosystem, created to spotlight entertainment, talent, culture, original stories, and the people shaping what comes next.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 2,
    title: "The People Behind the Culture",
    slug: "people-behind-the-culture",
    category: "Aset Spotlight",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "ASET Spotlight expands into long-form editorial profiles and conversations with creators, performers, and entertainment professionals.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 3,
    title: "What Makes Television Worth Talking About?",
    slug: "television-worth-talking-about",
    category: "Film + Television",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "Characters, performances, storytelling, and the moments that keep audiences watching.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 4,
    title: "Entertainment Is More Than the Screen",
    slug: "entertainment-beyond-the-screen",
    category: "Culture",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "Lifestyle, movements, fashion, music, and social culture become part of the story.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 5,
    title: "The Editorial Image",
    slug: "the-editorial-image",
    category: "Beauty + Style",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "Photography, beauty, fashion, and visual identity meet inside the world of ASET.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 6,
    title: "The Performances We Remember",
    slug: "performances-we-remember",
    category: "Film + Television",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "A closer look at the performances and creative choices that remain part of the conversation.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 7,
    title: "Characters That Take Over the Conversation",
    slug: "characters-that-take-over",
    category: "Opinion",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "Sometimes one character becomes impossible for an audience to stop discussing.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 8,
    title: "Inside Modern Entertainment",
    slug: "inside-modern-entertainment",
    category: "Film + Television",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "Exploring an entertainment landscape where stories move between screens, platforms, publications, and audiences.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 9,
    title: "The Culture Behind the Camera",
    slug: "culture-behind-the-camera",
    category: "Culture",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "The creative worlds surrounding entertainment can become just as influential as what appears on screen.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 10,
    title: "Beauty as Storytelling",
    slug: "beauty-as-storytelling",
    category: "Beauty + Style",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "Beauty can establish character, atmosphere, visual identity, and editorial direction.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 11,
    title: "Creating the Editorial Look",
    slug: "creating-editorial-look",
    category: "Beauty + Style",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "A strong editorial image begins long before the shutter clicks.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 12,
    title: "Inside The Aset Studio Photography Room",
    slug: "aset-photography-room",
    category: "Photography",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "The Aset Studio's visual storytelling language moves into the pages of ASET.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 13,
    title: "Building Original Worlds",
    slug: "building-original-worlds",
    category: "Aset Originals",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: false,
    coverStory: false,
    excerpt:
      "A look inside concept, visual development, and entertainment properties being created by The Aset Studio.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
  {
    id: 14,
    title: "Inside the World of ANI",
    slug: "inside-the-world-of-ani",
    category: "ANI",
    issue: "Issue 001",
    author: "ASET Editorial",
    status: "Published",
    featured: true,
    coverStory: false,
    excerpt:
      "Characters, locations, visual development, production concepts, and exclusive editorial material from The Aset Studio's original entertainment property.",
    body: "",
    image: "",
    updated: "Sep 17, 2026",
  },
];

const defaultIssues = [
  {
    id: 1,
    number: "001",
    title: "The Premiere Issue",
    slug: "issue-001",
    date: "September 2026",
    description:
      "The first issue of ASET begins a new chapter in entertainment, culture, creativity, visual storytelling, and original editorial publishing from The Aset Studio.",
    status: "Published",
  },
];

const defaultCategories = [
  "Cover Story",
  "Aset Spotlight",
  "Film + Television",
  "Music",
  "Culture",
  "Beauty + Style",
  "Photography",
  "Aset Originals",
  "ANI",
  "Opinion",
];

const defaultContributors = [
  {
    id: 1,
    name: "ASET Editorial",
    role: "Editorial Team",
    status: "Active",
  },
];
const defaultSubmissions = [];

/* =========================================================
   HELPERS
========================================================= */

function loadLocal(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error(`ASET localStorage read error: ${key}`, error);
    return fallback;
  }
}

function makeSlug(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/['â€™]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatToday() {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatusBadge({ status }) {
  const published = status === "Published";
  const draft = status === "Draft";

  return (
    <span
      style={{
        ...styles.statusBadge,
        color: published
          ? COLORS.green
          : draft
          ? COLORS.amber
          : COLORS.muted,
        background: published
          ? "rgba(40,99,60,.09)"
          : draft
          ? "rgba(138,91,18,.09)"
          : "rgba(5,5,5,.06)",
      }}
    >
      {status}
    </span>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div style={styles.sectionHeading}>
      <div>
        <div style={styles.eyebrow}>{eyebrow}</div>
        <h2 style={styles.sectionTitle}>{title}</h2>
      </div>

      {action}
    </div>
  );
}

function MetricCard({ label, value, detail, dark }) {
  return (
    <div
      style={{
        ...styles.metricCard,
        ...(dark ? styles.metricCardDark : {}),
      }}
    >
      <div
        style={{
          ...styles.metricLabel,
          color: dark
            ? "rgba(244,239,230,.55)"
            : COLORS.muted,
        }}
      >
        {label}
      </div>

      <div
        style={{
          ...styles.metricValue,
          color: dark ? COLORS.cream : COLORS.black,
        }}
      >
        {value}
      </div>

      <div
        style={{
          ...styles.metricDetail,
          color: dark
            ? "rgba(244,239,230,.5)"
            : COLORS.muted,
        }}
      >
        {detail}
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardView({
  articles,
  issues,
  categories,
  contributors,
  setActiveView,
  openNewArticle,
  openEditArticle,
}) {
  const published = articles.filter(
    (article) => article.status === "Published"
  ).length;

  const drafts = articles.filter(
    (article) => article.status === "Draft"
  ).length;

  const featured = articles.filter(
    (article) => article.featured
  ).length;

  const currentIssue = issues[0];

  return (
    <>
      <section style={styles.welcome}>
        <div>
          <div style={styles.eyebrow}>ASET MAGAZINE</div>

          <h1 style={styles.pageTitle}>
            Editorial
            <br />
            Command Center
          </h1>

          <p style={styles.pageIntro}>
            Build, organize, preview, and publish the editorial
            world of ASET from one workspace.
          </p>
        </div>

        <div style={styles.buttonRow}>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={openNewArticle}
          >
            + NEW ARTICLE
          </button>

          <Link
            to="/aset"
            target="_blank"
            rel="noreferrer"
            style={styles.outlineButton}
          >
            VIEW ASET â†—
          </Link>
        </div>
      </section>

      <section className="aset-metrics" style={styles.metrics}>
        <MetricCard
          label="ARTICLES"
          value={articles.length}
          detail={`${published} published Â· ${drafts} drafts`}
        />

        <MetricCard
          label="ISSUES"
          value={issues.length}
          detail="Publication archive"
        />

        <MetricCard
          label="CATEGORIES"
          value={categories.length}
          detail="Editorial departments"
        />

        <MetricCard
          label="FEATURED"
          value={featured}
          detail="Priority stories"
          dark
        />
      </section>

      <section
        className="aset-dashboard-grid"
        style={styles.dashboardGrid}
      >
        <div style={styles.panel}>
          <SectionHeading
            eyebrow="EDITORIAL"
            title="Recent Stories"
            action={
              <button
                type="button"
                style={styles.textButton}
                onClick={() => setActiveView("articles")}
              >
                VIEW ALL â†’
              </button>
            }
          />

          {articles.slice(0, 7).map((article) => (
            <button
              key={article.id}
              type="button"
              style={styles.recentArticle}
              onClick={() => openEditArticle(article)}
            >
              <div>
                <div style={styles.smallBlue}>
                  {article.category}
                </div>

                <div style={styles.recentTitle}>
                  {article.title}
                </div>

                <div style={styles.smallMuted}>
                  {article.issue} Â· {article.author}
                </div>
              </div>

              <StatusBadge status={article.status} />
            </button>
          ))}
        </div>

        <div style={styles.sideStack}>
          {currentIssue && (
            <div style={styles.currentIssue}>
              <div style={styles.darkEyebrow}>
                CURRENT ISSUE
              </div>

              <div style={styles.bigIssueNumber}>
                {currentIssue.number}
              </div>

              <h3 style={styles.currentIssueTitle}>
                {currentIssue.title}
              </h3>

              <div style={styles.issueDate}>
                {currentIssue.date}
              </div>

              <Link
                to={`/aset/issues/${currentIssue.slug}`}
                target="_blank"
                rel="noreferrer"
                style={styles.blackButton}
              >
                VIEW ISSUE â†—
              </Link>
            </div>
          )}

          <div style={styles.quickPanel}>
            <h3 style={styles.quickTitle}>Quick Actions</h3>

            <button
              type="button"
              style={styles.quickAction}
              onClick={openNewArticle}
            >
              Create article <span>+</span>
            </button>

            <button
              type="button"
              style={styles.quickAction}
              onClick={() => setActiveView("issues")}
            >
              Manage issues <span>â†’</span>
            </button>

            <button
              type="button"
              style={styles.quickAction}
              onClick={() => setActiveView("categories")}
            >
              Categories <span>â†’</span>
            </button>

            <button
              type="button"
              style={styles.quickAction}
              onClick={() => setActiveView("contributors")}
            >
              Contributors <span>â†’</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   ARTICLES
========================================================= */

function ArticlesView({
  articles,
  openNewArticle,
  openEditArticle,
  deleteArticle,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categoryOptions = useMemo(
    () =>
      [...new Set(articles.map((article) => article.category))].sort(),
    [articles]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.slug.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        article.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        article.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    articles,
    search,
    statusFilter,
    categoryFilter,
  ]);

  return (
    <>
      <SectionHeading
        eyebrow="EDITORIAL LIBRARY"
        title="Articles"
        action={
          <button
            type="button"
            style={styles.primaryButton}
            onClick={openNewArticle}
          >
            + NEW ARTICLE
          </button>
        }
      />

      <div className="aset-toolbar" style={styles.toolbar}>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search stories..."
          style={styles.searchInput}
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          style={styles.filterSelect}
        >
          <option>All</option>
          <option>Published</option>
          <option>Draft</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
          style={styles.filterSelect}
        >
          <option>All</option>

          {categoryOptions.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <div style={styles.resultCount}>
          {filtered.length} STORIES
        </div>
      </div>

      <div className="aset-table-wrap" style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ARTICLE</th>
              <th style={styles.th}>CATEGORY</th>
              <th style={styles.th}>ISSUE</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>FLAGS</th>
              <th style={styles.th}>UPDATED</th>
              <th style={styles.th}></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((article) => (
              <tr key={article.id}>
                <td style={styles.td}>
                  <div style={styles.tableTitle}>
                    {article.title}
                  </div>

                  <div style={styles.tableSlug}>
                    /aset/articles/{article.slug}
                  </div>
                </td>

                <td style={styles.td}>
                  {article.category}
                </td>

                <td style={styles.td}>
                  {article.issue}
                </td>

                <td style={styles.td}>
                  <StatusBadge status={article.status} />
                </td>

                <td style={styles.td}>
                  <div style={styles.flagStack}>
                    {article.coverStory && (
                      <span style={styles.flag}>COVER</span>
                    )}

                    {article.featured && (
                      <span style={styles.flag}>FEATURED</span>
                    )}
                  </div>
                </td>

                <td style={styles.td}>
                  {article.updated}
                </td>

                <td style={styles.td}>
                  <div style={styles.tableActions}>
                    {article.status === "Published" && (
                      <Link
                        to={`/aset/articles/${article.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.previewButton}
                      >
                        VIEW
                      </Link>
                    )}

                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() => openEditArticle(article)}
                    >
                      EDIT
                    </button>

                    <button
                      type="button"
                      style={styles.deleteButton}
                      onClick={() => deleteArticle(article)}
                    >
                      DELETE
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td
                  colSpan="7"
                  style={styles.emptyTable}
                >
                  No stories match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =========================================================
   ISSUES
========================================================= */

function IssuesView({
  issues,
  articles,
  openIssueEditor,
}) {
  return (
    <>
      <SectionHeading
        eyebrow="PUBLICATION ARCHIVE"
        title="Issues"
        action={
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => openIssueEditor(null)}
          >
            + NEW ISSUE
          </button>
        }
      />

      <div style={styles.issueGrid}>
        {issues.map((issue) => {
          const issueName = `Issue ${issue.number}`;

          const issueArticles = articles.filter(
            (article) => article.issue === issueName
          );

          const coverStory = issueArticles.find(
            (article) => article.coverStory
          );

          return (
            <article
              key={issue.id}
              className="aset-issue-card"
              style={styles.issueCard}
            >
              <div
                className="aset-issue-cover"
                style={styles.issueCover}
              >
                <div style={styles.issueCoverLogo}>ASET</div>

                <div style={styles.issueCoverCenter}>
                  <div style={styles.darkEyebrow}>
                    ISSUE
                  </div>

                  <div style={styles.issueCoverNumber}>
                    {issue.number}
                  </div>
                </div>

                <div style={styles.issueCoverFooter}>
                  ENTERTAINMENT
                  <br />
                  CULTURE
                  <br />
                  CREATIVITY
                </div>
              </div>

              <div style={styles.issueContent}>
                <div style={styles.smallBlue}>
                  ISSUE {issue.number}
                </div>

                <h3 style={styles.issueAdminTitle}>
                  {issue.title}
                </h3>

                <div style={styles.smallMuted}>
                  {issue.date}
                </div>

                <p style={styles.issueDescription}>
                  {issue.description}
                </p>

                <div style={styles.issueStats}>
                  <div>
                    <strong>{issueArticles.length}</strong>
                    <span> STORIES</span>
                  </div>

                  <div>
                    <strong>
                      {coverStory?.title || "Not assigned"}
                    </strong>
                    <span> COVER STORY</span>
                  </div>
                </div>

                <div style={styles.issueActions}>
                  <StatusBadge status={issue.status} />

                  <div style={styles.buttonRow}>
                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() => openIssueEditor(issue)}
                    >
                      EDIT
                    </button>

                    <Link
                      to={`/aset/issues/${issue.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.previewButton}
                    >
                      VIEW ISSUE â†—
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

/* =========================================================
   CATEGORIES
========================================================= */

function CategoriesView({
  categories,
  setCategories,
  articles,
}) {
  const [newCategory, setNewCategory] = useState("");

  function addCategory() {
    const clean = newCategory.trim();

    if (!clean) return;

    const exists = categories.some(
      (category) =>
        category.toLowerCase() === clean.toLowerCase()
    );

    if (exists) {
      setNewCategory("");
      return;
    }

    setCategories((current) => [...current, clean]);
    setNewCategory("");
  }

  function removeCategory(category) {
    const inUse = articles.some(
      (article) => article.category === category
    );

    if (inUse) {
      window.alert(
        `"${category}" is currently assigned to an article. Reassign those stories before removing the category.`
      );
      return;
    }

    if (
      window.confirm(
        `Remove the "${category}" category?`
      )
    ) {
      setCategories((current) =>
        current.filter((item) => item !== category)
      );
    }
  }

  return (
    <>
      <SectionHeading
        eyebrow="EDITORIAL ORGANIZATION"
        title="Categories"
      />

      <div style={styles.categoryCreator}>
        <input
          value={newCategory}
          onChange={(event) =>
            setNewCategory(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addCategory();
            }
          }}
          placeholder="New category name"
          style={styles.searchInput}
        />

        <button
          type="button"
          style={styles.primaryButton}
          onClick={addCategory}
        >
          ADD CATEGORY
        </button>
      </div>

      <div
        className="aset-category-grid"
        style={styles.categoryGrid}
      >
        {categories.map((category, index) => {
          const count = articles.filter(
            (article) => article.category === category
          ).length;

          return (
            <div
              key={category}
              style={styles.categoryCard}
            >
              <div style={styles.categoryNumber}>
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <div style={styles.categoryName}>
                  {category}
                </div>

                <div style={styles.smallMuted}>
                  {count} {count === 1 ? "story" : "stories"}
                </div>
              </div>

              <button
                type="button"
                style={styles.removeButton}
                onClick={() => removeCategory(category)}
              >
                REMOVE
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* =========================================================
   CONTRIBUTORS
========================================================= */

function ContributorsView({
  contributors,
  articles,
  openContributorEditor,
  deleteContributor,
}) {
  return (
    <>
      <SectionHeading
        eyebrow="MASTHEAD"
        title="Contributors"
        action={
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => openContributorEditor(null)}
          >
            + NEW CONTRIBUTOR
          </button>
        }
      />

      <div style={styles.contributorGrid}>
        {contributors.map((contributor) => {
          const articleCount = articles.filter(
            (article) =>
              article.author === contributor.name
          ).length;

          return (
            <div
              key={contributor.id}
              className="aset-contributor-card"
              style={styles.contributorCard}
            >
              <div style={styles.contributorInitial}>
                {contributor.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={styles.contributorName}>
                  {contributor.name}
                </div>

                <div style={styles.smallBlue}>
                  {contributor.role}
                </div>

                <div style={styles.smallMuted}>
                  {articleCount}{" "}
                  {articleCount === 1
                    ? "article"
                    : "articles"}
                </div>
              </div>

              <StatusBadge status={contributor.status} />

              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={styles.editButton}
                  onClick={() =>
                    openContributorEditor(contributor)
                  }
                >
                  EDIT
                </button>

                <button
                  type="button"
                  style={styles.deleteButton}
                  onClick={() =>
                    deleteContributor(contributor)
                  }
                >
                  DELETE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* =========================================================
   SUBMISSIONS
========================================================= */

function SubmissionsView({
  submissions,
  openSubmissionEditor,
  deleteSubmission,
  convertSubmissionToArticle,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return submissions.filter((submission) => {
      const matchesSearch =
        !query ||
        submission.name
          ?.toLowerCase()
          .includes(query) ||
        submission.email
          ?.toLowerCase()
          .includes(query) ||
        submission.title
          ?.toLowerCase()
          .includes(query) ||
        submission.category
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        submission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, search, statusFilter]);

  const newCount = submissions.filter(
    (item) => item.status === "New"
  ).length;

  const reviewingCount = submissions.filter(
    (item) => item.status === "Reviewing"
  ).length;

  const acceptedCount = submissions.filter(
    (item) => item.status === "Accepted"
  ).length;

  const convertedCount = submissions.filter(
    (item) => item.status === "Article Created"
  ).length;

  return (
    <>
      <SectionHeading
        eyebrow="EDITORIAL PIPELINE"
        title="Submissions"
        action={
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() =>
              openSubmissionEditor(null)
            }
          >
            + NEW SUBMISSION
          </button>
        }
      />

      <div
        className="aset-metrics"
        style={styles.metrics}
      >
        <MetricCard
          label="NEW"
          value={newCount}
          detail="Awaiting review"
        />

        <MetricCard
          label="REVIEWING"
          value={reviewingCount}
          detail="Under consideration"
        />

        <MetricCard
          label="ACCEPTED"
          value={acceptedCount}
          detail="Ready for editorial"
        />

        <MetricCard
          label="ARTICLES"
          value={convertedCount}
          detail="Converted to stories"
          dark
        />
      </div>

      <div
        className="aset-toolbar"
        style={styles.toolbar}
      >
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search submissions..."
          style={styles.searchInput}
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          style={styles.filterSelect}
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Accepted">Accepted</option>
          <option value="Article Created">
            Article Created
          </option>
          <option value="Declined">Declined</option>
        </select>

        <div style={styles.resultCount}>
          {filtered.length} SUBMISSIONS
        </div>
      </div>

      <div
        className="aset-table-wrap"
        style={styles.tableWrap}
      >
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>SUBMISSION</th>
              <th style={styles.th}>SUBMITTER</th>
              <th style={styles.th}>CATEGORY</th>
              <th style={styles.th}>ISSUE</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>RECEIVED</th>
              <th style={styles.th}></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((submission) => (
              <tr key={submission.id}>
                <td style={styles.td}>
                  <div style={styles.tableTitle}>
                    {submission.title}
                  </div>

                  <div style={styles.tableSlug}>
                    {submission.type || "Editorial Pitch"}
                  </div>
                </td>

                <td style={styles.td}>
                  <strong>{submission.name}</strong>

                  <div style={styles.tableSlug}>
                    {submission.email}
                  </div>
                </td>

                <td style={styles.td}>
                  {submission.category}
                </td>

                <td style={styles.td}>
                  {submission.issue || "Unassigned"}
                </td>

                <td style={styles.td}>
                  <StatusBadge
                    status={submission.status}
                  />
                </td>

                <td style={styles.td}>
                  {submission.received}
                </td>

                <td style={styles.td}>
                  <div style={styles.tableActions}>
                    {submission.status ===
                      "Accepted" && (
                      <button
                        type="button"
                        style={styles.previewButton}
                        onClick={() =>
                          convertSubmissionToArticle(
                            submission
                          )
                        }
                      >
                        CREATE ARTICLE
                      </button>
                    )}

                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() =>
                        openSubmissionEditor(
                          submission
                        )
                      }
                    >
                      REVIEW
                    </button>

                    <button
                      type="button"
                      style={styles.deleteButton}
                      onClick={() =>
                        deleteSubmission(
                          submission
                        )
                      }
                    >
                      DELETE
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td
                  colSpan="7"
                  style={styles.emptyTable}
                >
                  No submissions yet. When pitches
                  begin arriving, this becomes the
                  ASET editorial inbox.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =========================================================
   ARTICLE EDITOR
========================================================= */

function ArticleEditor({
  article,
  categories,
  issues,
  contributors,
  onClose,
  onSave,
}) {
  const editing = Boolean(article);

  const [form, setForm] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    category:
      article?.category || categories[0] || "",
    issue: article?.issue || "Unassigned",
    author:
      article?.author ||
      contributors[0]?.name ||
      "ASET Editorial",
    status: article?.status || "Draft",
    featured: article?.featured || false,
    coverStory: article?.coverStory || false,
    excerpt: article?.excerpt || "",
    body: article?.body || "",
    image: article?.image || "",
  });

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function titleChanged(value) {
    setForm((current) => {
      const oldAutoSlug = makeSlug(current.title);

      return {
        ...current,
        title: value,
        slug:
          !editing ||
          !current.slug ||
          current.slug === oldAutoSlug
            ? makeSlug(value)
            : current.slug,
      };
    });
  }

  function submit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      window.alert("Add an article title first.");
      return;
    }

    if (!form.slug.trim()) {
      window.alert("The article needs a URL slug.");
      return;
    }

    onSave({
      ...article,
      ...form,
      title: form.title.trim(),
      slug: makeSlug(form.slug),
    });
  }

  return (
    <div style={styles.overlay}>
      <div
        className="aset-editor-modal"
        style={styles.editorModal}
      >
        <header style={styles.modalHeader}>
          <div>
            <div style={styles.darkEyebrow}>
              {editing ? "EDIT ARTICLE" : "NEW ARTICLE"}
            </div>

            <h2 style={styles.modalTitle}>
              {editing ? article.title : "Create Story"}
            </h2>
          </div>

          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
          >
            Ã—
          </button>
        </header>

        <form onSubmit={submit} style={styles.editorForm}>
          <div style={styles.formSection}>
            <div style={styles.formSectionTitle}>
              STORY INFORMATION
            </div>

            <label style={styles.field}>
              <span style={styles.label}>ARTICLE TITLE</span>

              <input
                value={form.title}
                onChange={(event) =>
                  titleChanged(event.target.value)
                }
                placeholder="Enter story title"
                style={styles.input}
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>URL SLUG</span>

              <div style={styles.slugField}>
                <span style={styles.slugPrefix}>
                  /aset/articles/
                </span>

                <input
                  value={form.slug}
                  onChange={(event) =>
                    update("slug", event.target.value)
                  }
                  style={styles.slugInput}
                />
              </div>
            </label>

            <div
              className="aset-form-grid"
              style={styles.formGrid}
            >
              <label style={styles.field}>
                <span style={styles.label}>CATEGORY</span>

                <select
                  value={form.category}
                  onChange={(event) =>
                    update("category", event.target.value)
                  }
                  style={styles.input}
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>ISSUE</span>

                <select
                  value={form.issue}
                  onChange={(event) =>
                    update("issue", event.target.value)
                  }
                  style={styles.input}
                >
                  <option value="Unassigned">
                    Unassigned
                  </option>

                  {issues.map((issue) => (
                    <option
                      key={issue.id}
                      value={`Issue ${issue.number}`}
                    >
                      Issue {issue.number}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>AUTHOR</span>

                <select
                  value={form.author}
                  onChange={(event) =>
                    update("author", event.target.value)
                  }
                  style={styles.input}
                >
                  {contributors.map((contributor) => (
                    <option
                      key={contributor.id}
                      value={contributor.name}
                    >
                      {contributor.name}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>STATUS</span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    update("status", event.target.value)
                  }
                  style={styles.input}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">
                    Published
                  </option>
                </select>
              </label>
            </div>
          </div>

          <div style={styles.formSection}>
            <div style={styles.formSectionTitle}>
              EDITORIAL CONTENT
            </div>

            <label style={styles.field}>
              <span style={styles.label}>
                EXCERPT / DEK
              </span>

              <textarea
                value={form.excerpt}
                onChange={(event) =>
                  update("excerpt", event.target.value)
                }
                placeholder="Short description shown beneath the headline..."
                style={{
                  ...styles.input,
                  minHeight: "110px",
                  resize: "vertical",
                }}
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>
                ARTICLE BODY
              </span>

              <textarea
                value={form.body}
                onChange={(event) =>
                  update("body", event.target.value)
                }
                placeholder="Write or paste the full article here..."
                style={{
                  ...styles.input,
                  minHeight: "330px",
                  resize: "vertical",
                  fontFamily:
                    '"Times New Roman", Georgia, serif',
                  fontSize: "17px",
                  lineHeight: 1.65,
                }}
              />
            </label>
          </div>

          <div style={styles.formSection}>
            <div style={styles.formSectionTitle}>
              VISUALS + PLACEMENT
            </div>

            <label style={styles.field}>
              <span style={styles.label}>
                FEATURE IMAGE URL
              </span>

              <input
                value={form.image}
                onChange={(event) =>
                  update("image", event.target.value)
                }
                placeholder="Image URL"
                style={styles.input}
              />
            </label>

            {form.image && (
              <div style={styles.imagePreview}>
                <img
                  src={form.image}
                  alt=""
                  style={styles.imagePreviewImg}
                />
              </div>
            )}

            <div
              className="aset-option-grid"
              style={styles.optionGrid}
            >
              <label style={styles.optionCard}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    update(
                      "featured",
                      event.target.checked
                    )
                  }
                />

                <span>
                  <strong>Featured Story</strong>
                  <small>
                    Give this article priority placement
                    throughout ASET.
                  </small>
                </span>
              </label>

              <label style={styles.optionCard}>
                <input
                  type="checkbox"
                  checked={form.coverStory}
                  onChange={(event) =>
                    update(
                      "coverStory",
                      event.target.checked
                    )
                  }
                />

                <span>
                  <strong>Cover Story</strong>
                  <small>
                    Designate this as the lead story for its
                    assigned issue.
                  </small>
                </span>
              </label>
            </div>
          </div>

          <div style={styles.localNotice}>
            <strong>LOCAL EDITORIAL MODE</strong>
            <br />
            Changes now persist in this browser using
            localStorage. When Supabase is reconnected, this
            storage layer can be replaced with the magazine
            database.
          </div>

          <div style={styles.modalActions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onClose}
            >
              CANCEL
            </button>

            <button
              type="submit"
              style={styles.primaryButton}
            >
              {editing
                ? "SAVE CHANGES"
                : "CREATE ARTICLE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   ISSUE EDITOR
========================================================= */

function IssueEditor({
  issue,
  articles,
  onClose,
  onSave,
}) {
  const editing = Boolean(issue);

  const [form, setForm] = useState({
    number: issue?.number || "",
    title: issue?.title || "",
    slug: issue?.slug || "",
    date: issue?.date || "",
    description: issue?.description || "",
    status: issue?.status || "Draft",

    coverImage:
      issue?.coverImage ||
      issue?.image ||
      "",

    coverLine:
      issue?.coverLine || "",

    theme:
      issue?.theme || "Editorial",

    editorNote:
      issue?.editorNote || "",
  });

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function normalizeNumber(value) {
    const digits = String(value)
      .replace(/\D/g, "")
      .slice(0, 3);

    if (!digits) {
      return "";
    }

    return digits.padStart(3, "0");
  }

  function numberChanged(value) {
    const cleanNumber =
      value.replace(/\D/g, "").slice(0, 3);

    setForm((current) => {
      const previousNumber =
        current.number || "";

      const previousAutoSlug =
        previousNumber
          ? `issue-${previousNumber}`
          : "";

      const nextSlug =
        !editing ||
        !current.slug ||
        current.slug === previousAutoSlug
          ? cleanNumber
            ? `issue-${cleanNumber}`
            : ""
          : current.slug;

      return {
        ...current,
        number: cleanNumber,
        slug: nextSlug,
      };
    });
  }

  function submit(event) {
    event.preventDefault();

    const cleanNumber =
      normalizeNumber(form.number);

    if (
      !cleanNumber ||
      !form.title.trim()
    ) {
      window.alert(
        "Issue number and issue title are required."
      );

      return;
    }

    const finalSlug =
      makeSlug(form.slug) ||
      `issue-${cleanNumber}`;

    onSave({
      ...issue,
      ...form,

      number: cleanNumber,

      title:
        form.title.trim(),

      slug:
        finalSlug,

      date:
        form.date.trim(),

      description:
        form.description.trim(),

      coverImage:
        form.coverImage.trim(),

      coverLine:
        form.coverLine.trim(),

      editorNote:
        form.editorNote.trim(),
    });
  }

  const issueName =
    form.number
      ? `Issue ${normalizeNumber(
          form.number
        )}`
      : "";

  const assignedArticles =
    issueName
      ? articles.filter(
          (article) =>
            article.issue ===
            issueName
        )
      : [];

  const publishedArticles =
    assignedArticles.filter(
      (article) =>
        article.status ===
        "Published"
    );

  const draftArticles =
    assignedArticles.filter(
      (article) =>
        article.status ===
        "Draft"
    );

  const coverStory =
    assignedArticles.find(
      (article) =>
        article.coverStory
    );

  return (
    <div style={styles.overlay}>
      <div
        className="aset-editor-modal"
        style={styles.editorModal}
      >
        {/* HEADER */}

        <header
          style={styles.modalHeader}
        >
          <div>
            <div
              style={
                styles.darkEyebrow
              }
            >
              {editing
                ? "EDIT ISSUE"
                : "NEW ISSUE"}
            </div>

            <h2
              style={
                styles.modalTitle
              }
            >
              {editing
                ? issue.title
                : "Build New Issue"}
            </h2>
          </div>

          <button
            type="button"
            style={
              styles.closeButton
            }
            onClick={onClose}
          >
            Ã—
          </button>
        </header>

        <form
          onSubmit={submit}
          style={styles.editorForm}
        >
          {/* =================================
              PUBLICATION INFORMATION
          ================================= */}

          <div
            style={
              styles.formSection
            }
          >
            <div
              style={
                styles.formSectionTitle
              }
            >
              PUBLICATION INFORMATION
            </div>

            <div
              className="aset-form-grid"
              style={styles.formGrid}
            >
              <label
                style={styles.field}
              >
                <span
                  style={styles.label}
                >
                  ISSUE NUMBER
                </span>

                <input
                  value={form.number}
                  onChange={(event) =>
                    numberChanged(
                      event.target.value
                    )
                  }
                  placeholder="002"
                  inputMode="numeric"
                  style={styles.input}
                />
              </label>

              <label
                style={styles.field}
              >
                <span
                  style={styles.label}
                >
                  PUBLICATION DATE
                </span>

                <input
                  value={form.date}
                  onChange={(event) =>
                    update(
                      "date",
                      event.target.value
                    )
                  }
                  placeholder="October 2026"
                  style={styles.input}
                />
              </label>

              <label
                style={styles.field}
              >
                <span
                  style={styles.label}
                >
                  ISSUE THEME
                </span>

                <select
                  value={form.theme}
                  onChange={(event) =>
                    update(
                      "theme",
                      event.target.value
                    )
                  }
                  style={styles.input}
                >
                  <option value="Editorial">
                    Editorial
                  </option>

                  <option value="Entertainment">
                    Entertainment
                  </option>

                  <option value="Culture">
                    Culture
                  </option>

                  <option value="Spotlight">
                    Spotlight
                  </option>

                  <option value="Originals">
                    Originals
                  </option>

                  <option value="Special Edition">
                    Special Edition
                  </option>
                </select>
              </label>

              <label
                style={styles.field}
              >
                <span
                  style={styles.label}
                >
                  STATUS
                </span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    update(
                      "status",
                      event.target.value
                    )
                  }
                  style={styles.input}
                >
                  <option value="Draft">
                    Draft
                  </option>

                  <option value="Published">
                    Published
                  </option>
                </select>
              </label>
            </div>

            <label
              style={styles.field}
            >
              <span
                style={styles.label}
              >
                ISSUE TITLE
              </span>

              <input
                value={form.title}
                onChange={(event) =>
                  update(
                    "title",
                    event.target.value
                  )
                }
                placeholder="The Premiere Issue"
                style={styles.input}
              />
            </label>

            <label
              style={styles.field}
            >
              <span
                style={styles.label}
              >
                URL SLUG
              </span>

              <div
                style={
                  styles.slugField
                }
              >
                <span
                  style={
                    styles.slugPrefix
                  }
                >
                  /aset/issues/
                </span>

                <input
                  value={form.slug}
                  onChange={(event) =>
                    update(
                      "slug",
                      event.target.value
                    )
                  }
                  placeholder="issue-001"
                  style={
                    styles.slugInput
                  }
                />
              </div>
            </label>
          </div>

          {/* =================================
              EDITORIAL IDENTITY
          ================================= */}

          <div
            style={
              styles.formSection
            }
          >
            <div
              style={
                styles.formSectionTitle
              }
            >
              EDITORIAL IDENTITY
            </div>

            <label
              style={styles.field}
            >
              <span
                style={styles.label}
              >
                ISSUE DESCRIPTION
              </span>

              <textarea
                value={
                  form.description
                }
                onChange={(event) =>
                  update(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the editorial direction of this issue..."
                style={{
                  ...styles.input,
                  minHeight:
                    "120px",
                  resize:
                    "vertical",
                }}
              />
            </label>

            <label
              style={styles.field}
            >
              <span
                style={styles.label}
              >
                COVER LINE
              </span>

              <input
                value={
                  form.coverLine
                }
                onChange={(event) =>
                  update(
                    "coverLine",
                    event.target.value
                  )
                }
                placeholder="The main editorial line displayed on the issue cover"
                style={styles.input}
              />
            </label>

            <label
              style={styles.field}
            >
              <span
                style={styles.label}
              >
                EDITOR'S NOTE
              </span>

              <textarea
                value={
                  form.editorNote
                }
                onChange={(event) =>
                  update(
                    "editorNote",
                    event.target.value
                  )
                }
                placeholder="Opening note from ASET Editorial..."
                style={{
                  ...styles.input,
                  minHeight:
                    "180px",
                  resize:
                    "vertical",
                  fontFamily:
                    '"Times New Roman", Georgia, serif',
                  fontSize:
                    "16px",
                  lineHeight: 1.6,
                }}
              />
            </label>
          </div>

          {/* =================================
              COVER ART
          ================================= */}

          <div
            style={
              styles.formSection
            }
          >
            <div
              style={
                styles.formSectionTitle
              }
            >
              ISSUE COVER
            </div>

            <label
              style={styles.field}
            >
              <span
                style={styles.label}
              >
                COVER IMAGE URL
              </span>

              <input
                value={
                  form.coverImage
                }
                onChange={(event) =>
                  update(
                    "coverImage",
                    event.target.value
                  )
                }
                placeholder="Paste the finished ASET cover image URL"
                style={styles.input}
              />
            </label>

            {form.coverImage ? (
              <div
                style={{
                  ...styles.imagePreview,
                  maxWidth:
                    "360px",
                }}
              >
                <img
                  src={
                    form.coverImage
                  }
                  alt="ASET issue cover preview"
                  style={{
                    ...styles.imagePreviewImg,
                    aspectRatio:
                      "3 / 4",
                    objectFit:
                      "cover",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  minHeight:
                    "250px",
                  maxWidth:
                    "360px",
                  padding:
                    "25px",
                  background:
                    COLORS.black,
                  color:
                    COLORS.cream,
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  justifyContent:
                    "space-between",
                }}
              >
                <div
                  style={{
                    fontFamily:
                      '"Times New Roman", Georgia, serif',
                    fontSize:
                      "54px",
                    letterSpacing:
                      "-3px",
                    lineHeight:
                      0.85,
                  }}
                >
                  ASET
                </div>

                <div>
                  <div
                    style={
                      styles.darkEyebrow
                    }
                  >
                    ISSUE
                  </div>

                  <div
                    style={{
                      fontFamily:
                        '"Times New Roman", Georgia, serif',
                      fontSize:
                        "72px",
                      lineHeight:
                        0.9,
                    }}
                  >
                    {normalizeNumber(
                      form.number
                    ) || "000"}
                  </div>
                </div>

                <div
                  style={{
                    fontSize:
                      "8px",
                    letterSpacing:
                      "1.7px",
                    lineHeight:
                      1.6,
                    fontWeight:
                      900,
                  }}
                >
                  {form.coverLine ||
                    form.title ||
                    "ASET MAGAZINE"}
                </div>
              </div>
            )}
          </div>

          {/* =================================
              ISSUE CONTENT
          ================================= */}

          <div
            style={
              styles.formSection
            }
          >
            <div
              style={
                styles.formSectionTitle
              }
            >
              ISSUE CONTENT
            </div>

            <div
              className="aset-metrics"
              style={{
                ...styles.metrics,
                marginBottom:
                  "25px",
              }}
            >
              <MetricCard
                label="ASSIGNED"
                value={
                  assignedArticles.length
                }
                detail="Stories in this issue"
              />

              <MetricCard
                label="PUBLISHED"
                value={
                  publishedArticles.length
                }
                detail="Public stories"
              />

              <MetricCard
                label="DRAFTS"
                value={
                  draftArticles.length
                }
                detail="Still in development"
              />

              <MetricCard
                label="COVER"
                value={
                  coverStory
                    ? "1"
                    : "0"
                }
                detail={
                  coverStory
                    ? coverStory.title
                    : "Not assigned"
                }
                dark
              />
            </div>

            {assignedArticles.length ? (
              <div
                style={{
                  borderTop:
                    `1px solid ${COLORS.line}`,
                }}
              >
                {assignedArticles.map(
                  (article) => (
                    <div
                      key={
                        article.id
                      }
                      style={{
                        padding:
                          "14px 0",
                        borderBottom:
                          `1px solid ${COLORS.line}`,
                        display:
                          "grid",
                        gridTemplateColumns:
                          "minmax(0,1fr) auto",
                        gap:
                          "20px",
                        alignItems:
                          "center",
                      }}
                    >
                      <div>
                        <div
                          style={
                            styles.smallBlue
                          }
                        >
                          {
                            article.category
                          }
                        </div>

                        <div
                          style={{
                            marginTop:
                              "4px",
                            fontFamily:
                              '"Times New Roman", Georgia, serif',
                            fontSize:
                              "18px",
                          }}
                        >
                          {
                            article.title
                          }
                        </div>

                        <div
                          style={
                            styles.smallMuted
                          }
                        >
                          {
                            article.author
                          }
                        </div>
                      </div>

                      <div
                        style={
                          styles.buttonRow
                        }
                      >
                        {article.coverStory ? (
                          <span
                            style={
                              styles.flag
                            }
                          >
                            COVER
                          </span>
                        ) : null}

                        {article.featured ? (
                          <span
                            style={
                              styles.flag
                            }
                          >
                            FEATURED
                          </span>
                        ) : null}

                        <StatusBadge
                          status={
                            article.status
                          }
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div
                style={
                  styles.localNotice
                }
              >
                <strong>
                  NO STORIES ASSIGNED YET
                </strong>

                <br />

                Save the issue first,
                then assign stories to
                it from the Article
                Editor.
              </div>
            )}
          </div>

          {/* =================================
              LOCAL MODE NOTICE
          ================================= */}

          <div
            style={
              styles.localNotice
            }
          >
            <strong>
              LOCAL EDITORIAL MODE
            </strong>

            <br />

            Issue settings are being
            saved in this browser using
            localStorage. The same issue
            structure can later move to
            Supabase without changing
            the editorial workflow.
          </div>

          {/* =================================
              ACTIONS
          ================================= */}

          <div
            style={
              styles.modalActions
            }
          >
            <button
              type="button"
              style={
                styles.cancelButton
              }
              onClick={onClose}
            >
              CANCEL
            </button>

            <button
              type="submit"
              style={
                styles.primaryButton
              }
            >
              {editing
                ? "SAVE ISSUE"
                : "CREATE ISSUE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   CONTRIBUTOR EDITOR
========================================================= */

function ContributorEditor({
  contributor,
  onClose,
  onSave,
}) {
  const editing = Boolean(contributor);

  const [form, setForm] = useState({
    name: contributor?.name || "",
    role: contributor?.role || "",
    status: contributor?.status || "Active",
  });

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert("Contributor name is required.");
      return;
    }

    onSave({
      ...contributor,
      ...form,
      name: form.name.trim(),
      role: form.role.trim(),
    });
  }

  return (
    <div style={styles.overlay}>
      <div
        className="aset-small-modal"
        style={styles.smallModal}
      >
        <header style={styles.modalHeader}>
          <div>
            <div style={styles.darkEyebrow}>
              {editing
                ? "EDIT CONTRIBUTOR"
                : "NEW CONTRIBUTOR"}
            </div>

            <h2 style={styles.modalTitle}>
              {editing
                ? contributor.name
                : "Add Contributor"}
            </h2>
          </div>

          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
          >
            Ã—
          </button>
        </header>

        <form onSubmit={submit} style={styles.editorForm}>
          <label style={styles.field}>
            <span style={styles.label}>NAME</span>

            <input
              value={form.name}
              onChange={(event) =>
                update("name", event.target.value)
              }
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>ROLE</span>

            <input
              value={form.role}
              onChange={(event) =>
                update("role", event.target.value)
              }
              placeholder="Writer, Photographer, Editor..."
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>STATUS</span>

            <select
              value={form.status}
              onChange={(event) =>
                update("status", event.target.value)
              }
              style={styles.input}
            >
              <option value="Active">Active</option>
              <option value="Inactive">
                Inactive
              </option>
            </select>
          </label>

          <div style={styles.modalActions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onClose}
            >
              CANCEL
            </button>

            <button
              type="submit"
              style={styles.primaryButton}
            >
              SAVE CONTRIBUTOR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   SUBMISSION EDITOR
========================================================= */

function SubmissionEditor({
  submission,
  categories,
  issues,
  onClose,
  onSave,
}) {
  const editing = Boolean(submission);

  const [form, setForm] = useState({
    name: submission?.name || "",
    email: submission?.email || "",
    social: submission?.social || "",
    title: submission?.title || "",
    type:
      submission?.type || "Editorial Pitch",
    category:
      submission?.category ||
      categories[0] ||
      "",
    issue:
      submission?.issue || "Unassigned",
    status:
      submission?.status || "New",
    pitch: submission?.pitch || "",
    bio: submission?.bio || "",
    notes: submission?.notes || "",
  });

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert(
        "Add the submitter's name."
      );
      return;
    }

    if (!form.title.trim()) {
      window.alert(
        "Add the proposed story title."
      );
      return;
    }

    if (!form.pitch.trim()) {
      window.alert(
        "Add the submission or pitch."
      );
      return;
    }

    onSave({
      ...submission,
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      social: form.social.trim(),
      title: form.title.trim(),
      pitch: form.pitch.trim(),
      bio: form.bio.trim(),
      notes: form.notes.trim(),
    });
  }

  return (
    <div style={styles.overlay}>
      <div
        className="aset-editor-modal"
        style={styles.editorModal}
      >
        <header style={styles.modalHeader}>
          <div>
            <div style={styles.darkEyebrow}>
              {editing
                ? "REVIEW SUBMISSION"
                : "NEW SUBMISSION"}
            </div>

            <h2 style={styles.modalTitle}>
              {editing
                ? submission.title
                : "Editorial Submission"}
            </h2>
          </div>

          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
          >
            Ã—
          </button>
        </header>

        <form
          onSubmit={submit}
          style={styles.editorForm}
        >
          <div style={styles.formSection}>
            <div style={styles.formSectionTitle}>
              SUBMITTER
            </div>

            <div
              className="aset-form-grid"
              style={styles.formGrid}
            >
              <label style={styles.field}>
                <span style={styles.label}>
                  NAME
                </span>

                <input
                  value={form.name}
                  onChange={(event) =>
                    update(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Full name"
                  style={styles.input}
                />
              </label>

              <label style={styles.field}>
                <span style={styles.label}>
                  EMAIL / CONTACT
                </span>

                <input
                  value={form.email}
                  onChange={(event) =>
                    update(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="Contact information"
                  style={styles.input}
                />
              </label>
            </div>

            <label style={styles.field}>
              <span style={styles.label}>
                WEBSITE / SOCIAL
              </span>

              <input
                value={form.social}
                onChange={(event) =>
                  update(
                    "social",
                    event.target.value
                  )
                }
                placeholder="Website, Instagram, portfolio, etc."
                style={styles.input}
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>
                SHORT BIO
              </span>

              <textarea
                value={form.bio}
                onChange={(event) =>
                  update(
                    "bio",
                    event.target.value
                  )
                }
                placeholder="Who is the submitter?"
                style={{
                  ...styles.input,
                  minHeight: "100px",
                  resize: "vertical",
                }}
              />
            </label>
          </div>

          <div style={styles.formSection}>
            <div style={styles.formSectionTitle}>
              SUBMISSION
            </div>

            <label style={styles.field}>
              <span style={styles.label}>
                PROPOSED TITLE
              </span>

              <input
                value={form.title}
                onChange={(event) =>
                  update(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Story or feature title"
                style={styles.input}
              />
            </label>

            <div
              className="aset-form-grid"
              style={styles.formGrid}
            >
              <label style={styles.field}>
                <span style={styles.label}>
                  SUBMISSION TYPE
                </span>

                <select
                  value={form.type}
                  onChange={(event) =>
                    update(
                      "type",
                      event.target.value
                    )
                  }
                  style={styles.input}
                >
                  <option value="Editorial Pitch">
                    Editorial Pitch
                  </option>

                  <option value="Completed Article">
                    Completed Article
                  </option>

                  <option value="Interview">
                    Interview / Profile
                  </option>

                  <option value="Photography">
                    Photography
                  </option>

                  <option value="Beauty + Style">
                    Beauty + Style
                  </option>

                  <option value="Creative Work">
                    Creative Work
                  </option>

                  <option value="Press Submission">
                    Press Submission
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>
                  CATEGORY
                </span>

                <select
                  value={form.category}
                  onChange={(event) =>
                    update(
                      "category",
                      event.target.value
                    )
                  }
                  style={styles.input}
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>
                  TARGET ISSUE
                </span>

                <select
                  value={form.issue}
                  onChange={(event) =>
                    update(
                      "issue",
                      event.target.value
                    )
                  }
                  style={styles.input}
                >
                  <option value="Unassigned">
                    Unassigned
                  </option>

                  {issues.map((issue) => (
                    <option
                      key={issue.id}
                      value={`Issue ${issue.number}`}
                    >
                      Issue {issue.number}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>
                  EDITORIAL STATUS
                </span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    update(
                      "status",
                      event.target.value
                    )
                  }
                  style={styles.input}
                >
                  <option value="New">New</option>
                  <option value="Reviewing">
                    Reviewing
                  </option>
                  <option value="Accepted">
                    Accepted
                  </option>
                  <option value="Article Created">
                    Article Created
                  </option>
                  <option value="Declined">
                    Declined
                  </option>
                </select>
              </label>
            </div>

            <label style={styles.field}>
              <span style={styles.label}>
                PITCH / SUBMISSION
              </span>

              <textarea
                value={form.pitch}
                onChange={(event) =>
                  update(
                    "pitch",
                    event.target.value
                  )
                }
                placeholder="Paste the pitch, article proposal, interview request, or submission here..."
                style={{
                  ...styles.input,
                  minHeight: "260px",
                  resize: "vertical",
                  fontFamily:
                    '"Times New Roman", Georgia, serif',
                  fontSize: "16px",
                  lineHeight: 1.6,
                }}
              />
            </label>
          </div>

          <div style={styles.formSection}>
            <div style={styles.formSectionTitle}>
              INTERNAL EDITORIAL NOTES
            </div>

            <textarea
              value={form.notes}
              onChange={(event) =>
                update(
                  "notes",
                  event.target.value
                )
              }
              placeholder="Private ASET notes, follow-up information, requested revisions, deadlines..."
              style={{
                ...styles.input,
                minHeight: "150px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={styles.localNotice}>
            <strong>
              INTERNAL EDITORIAL RECORD
            </strong>
            <br />
            This submission is not public. It stays
            inside the ASET Command Center until it
            is accepted and converted into an
            article.
          </div>

          <div style={styles.modalActions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onClose}
            >
              CANCEL
            </button>

            <button
              type="submit"
              style={styles.primaryButton}
            >
              {editing
                ? "SAVE REVIEW"
                : "ADD SUBMISSION"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



/* =========================================================
   MAIN PAGE
========================================================= */

function AdminAsetPage() {
  const [activeView, setActiveView] =
    useState("dashboard");

  const [articles, setArticles] = useState(() =>
    loadLocal(STORAGE.articles, defaultArticles)
  );

  const [issues, setIssues] = useState(() =>
    loadLocal(STORAGE.issues, defaultIssues)
  );

  const [categories, setCategories] = useState(() =>
    loadLocal(STORAGE.categories, defaultCategories)
  );

 const [contributors, setContributors] = useState(() =>
  loadLocal(
    STORAGE.contributors,
    defaultContributors
  )
);

const [submissions, setSubmissions] = useState(() =>
  loadLocal(
    STORAGE.submissions,
    defaultSubmissions
  )
);

const [
  submissionEditorOpen,
  setSubmissionEditorOpen,
] = useState(false);

const [
  editingSubmission,
  setEditingSubmission,
] = useState(null);

const [articleEditorOpen, setArticleEditorOpen] =
  useState(false);

  const [editingArticle, setEditingArticle] =
    useState(null);

  const [issueEditorOpen, setIssueEditorOpen] =
    useState(false);

  const [editingIssue, setEditingIssue] =
    useState(null);

  const [
    contributorEditorOpen,
    setContributorEditorOpen,
  ] = useState(false);

  const [
    editingContributor,
    setEditingContributor,
  ] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      STORAGE.articles,
      JSON.stringify(articles)
    );
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE.issues,
      JSON.stringify(issues)
    );
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE.categories,
      JSON.stringify(categories)
    );
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE.contributors,
      JSON.stringify(contributors)
    );
  }, [contributors]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE.submissions,
      JSON.stringify(submissions)
    );
  }, [submissions]);

  function openNewArticle() {
    setEditingArticle(null);
    setArticleEditorOpen(true);
  }

  function openEditArticle(article) {
    setEditingArticle(article);
    setArticleEditorOpen(true);
  }

  function closeArticleEditor() {
    setArticleEditorOpen(false);
    setEditingArticle(null);
  }

  function saveArticle(data) {
    if (data.coverStory && data.issue !== "Unassigned") {
      setArticles((current) =>
        current.map((article) => {
          if (
            article.id !== data.id &&
            article.issue === data.issue
          ) {
            return {
              ...article,
              coverStory: false,
            };
          }

          return article;
        })
      );
    }

    if (editingArticle) {
      setArticles((current) =>
        current.map((article) =>
          article.id === editingArticle.id
            ? {
                ...article,
                ...data,
                updated: formatToday(),
              }
            : article
        )
      );
    } else {
      setArticles((current) => [
        {
          ...data,
          id: Date.now(),
          updated: formatToday(),
        },
        ...current,
      ]);
    }

    closeArticleEditor();
    setActiveView("articles");
  }

  function deleteArticle(article) {
    const confirmed = window.confirm(
      `Delete "${article.title}" from the local ASET editorial library?`
    );

    if (!confirmed) return;

    setArticles((current) =>
      current.filter(
        (item) => item.id !== article.id
      )
    );
  }

  function openIssueEditor(issue) {
    setEditingIssue(issue);
    setIssueEditorOpen(true);
  }

  function closeIssueEditor() {
    setEditingIssue(null);
    setIssueEditorOpen(false);
  }

  function saveIssue(data) {
    if (editingIssue) {
      setIssues((current) =>
        current.map((issue) =>
          issue.id === editingIssue.id
            ? {
                ...issue,
                ...data,
              }
            : issue
        )
      );
    } else {
      setIssues((current) => [
        ...current,
        {
          ...data,
          id: Date.now(),
        },
      ]);
    }

    closeIssueEditor();
    setActiveView("issues");
  }

  function openContributorEditor(contributor) {
    setEditingContributor(contributor);
    setContributorEditorOpen(true);
  }

  function closeContributorEditor() {
    setEditingContributor(null);
    setContributorEditorOpen(false);
  }

  function saveContributor(data) {
    if (editingContributor) {
      setContributors((current) =>
        current.map((contributor) =>
          contributor.id === editingContributor.id
            ? {
                ...contributor,
                ...data,
              }
            : contributor
        )
      );
    } else {
      setContributors((current) => [
        ...current,
        {
          ...data,
          id: Date.now(),
        },
      ]);
    }

    closeContributorEditor();
    setActiveView("contributors");
  }

  function deleteContributor(contributor) {
    const inUse = articles.some(
      (article) =>
        article.author === contributor.name
    );

    if (inUse) {
      window.alert(
        `${contributor.name} is assigned to one or more articles. Reassign those stories before deleting the contributor.`
      );
      return;
    }

    if (
      window.confirm(
        `Delete contributor "${contributor.name}"?`
      )
    ) {
      setContributors((current) =>
        current.filter(
          (item) => item.id !== contributor.id
        )
      );
    }
  }

  function openSubmissionEditor(submission) {
  setEditingSubmission(submission);
  setSubmissionEditorOpen(true);
}

function closeSubmissionEditor() {
  setEditingSubmission(null);
  setSubmissionEditorOpen(false);
}

function saveSubmission(data) {
  if (editingSubmission) {
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === editingSubmission.id
          ? {
              ...submission,
              ...data,
              updated: formatToday(),
            }
          : submission
      )
    );
  } else {
    setSubmissions((current) => [
      {
        ...data,
        id: Date.now(),
        received: formatToday(),
        updated: formatToday(),
      },
      ...current,
    ]);
  }

  closeSubmissionEditor();
  setActiveView("submissions");
}

function deleteSubmission(submission) {
  const confirmed = window.confirm(
    `Delete submission "${submission.title}"?`
  );

  if (!confirmed) return;

  setSubmissions((current) =>
    current.filter(
      (item) => item.id !== submission.id
    )
  );
}

function convertSubmissionToArticle(submission) {
  const alreadyCreated =
    submission.status === "Article Created";

  if (alreadyCreated) {
    window.alert(
      "This submission has already been converted into an article."
    );
    return;
  }

  const articleId = Date.now();

  const newArticle = {
    id: articleId,
    title: submission.title,
    slug: makeSlug(submission.title),
    category:
      submission.category ||
      categories[0] ||
      "Culture",
    issue:
      submission.issue || "Unassigned",
    author: submission.name,
    status: "Draft",
    featured: false,
    coverStory: false,
    excerpt: "",
    body: submission.pitch || "",
    image: "",
    updated: formatToday(),
    submissionId: submission.id,
  };

  const contributorExists =
    contributors.some(
      (contributor) =>
        contributor.name
          .trim()
          .toLowerCase() ===
        submission.name
          .trim()
          .toLowerCase()
    );

  if (!contributorExists) {
    setContributors((current) => [
      ...current,
      {
        id: Date.now() + 1,
        name: submission.name,
        role: "Contributor",
        status: "Active",
      },
    ]);
  }

  setArticles((current) => [
    newArticle,
    ...current,
  ]);

  setSubmissions((current) =>
    current.map((item) =>
      item.id === submission.id
        ? {
            ...item,
            status: "Article Created",
            articleId,
            updated: formatToday(),
          }
        : item
    )
  );

  setEditingArticle(newArticle);
  setArticleEditorOpen(true);
}

  const navigation = [
  {
    id: "dashboard",
    number: "01",
    label: "Dashboard",
  },
  {
    id: "articles",
    number: "02",
    label: "Articles",
  },
  {
    id: "issues",
    number: "03",
    label: "Issues",
  },
  {
    id: "categories",
    number: "04",
    label: "Categories",
  },
  {
    id: "contributors",
    number: "05",
    label: "Contributors",
  },
  {
    id: "submissions",
    number: "06",
    label: "Submissions",
  },
];

  return (
    <main style={styles.page}>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          button,
          input,
          textarea,
          select {
            font: inherit;
          }

          button {
            cursor: pointer;
          }

          .aset-nav-button:hover {
            background: rgba(244,239,230,.08) !important;
          }

          .aset-dashboard-grid {
            display: grid;
            grid-template-columns: minmax(0,1.55fr) minmax(260px,.65fr);
            gap: 20px;
          }

          @media (max-width: 1100px) {
            .aset-admin-shell {
              grid-template-columns: 190px minmax(0,1fr) !important;
            }

            .aset-dashboard-grid {
              grid-template-columns: 1fr;
            }

            .aset-metrics {
              grid-template-columns: repeat(2,minmax(0,1fr)) !important;
            }
          }

          @media (max-width: 800px) {
            .aset-admin-shell {
              display: block !important;
            }

            .aset-sidebar {
              position: static !important;
              min-height: auto !important;
            }

            .aset-sidebar-nav {
              display: flex !important;
              overflow-x: auto;
              padding-bottom: 6px;
            }

            .aset-nav-button {
              min-width: max-content;
            }

            .aset-admin-main {
              padding: 35px 6% 70px !important;
            }

            .aset-welcome {
              grid-template-columns: 1fr !important;
            }

            .aset-toolbar {
              align-items: stretch !important;
              flex-direction: column;
            }

            .aset-table-wrap {
              overflow-x: auto;
            }

            .aset-issue-card {
              grid-template-columns: 160px 1fr !important;
            }

            .aset-contributor-card {
              grid-template-columns: 55px minmax(0,1fr) !important;
            }
          }

          @media (max-width: 560px) {
            .aset-metrics {
              grid-template-columns: 1fr !important;
            }

            .aset-form-grid,
            .aset-option-grid,
            .aset-category-grid {
              grid-template-columns: 1fr !important;
            }

            .aset-issue-card {
              grid-template-columns: 1fr !important;
            }

            .aset-issue-cover {
              max-width: 190px;
            }

            .aset-editor-modal,
            .aset-small-modal {
              width: 96% !important;
              max-height: 94vh !important;
            }
          }
        `}
      </style>

      <div
        className="aset-admin-shell"
        style={styles.shell}
      >
        <aside
          className="aset-sidebar"
          style={styles.sidebar}
        >
          <div>
            <div style={styles.sidebarBrand}>ASET</div>

            <div style={styles.sidebarSubtitle}>
              EDITORIAL ADMIN
            </div>
          </div>

          <nav
            className="aset-sidebar-nav"
            style={styles.sidebarNav}
          >
            {navigation.map((item) => {
              const active =
                activeView === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className="aset-nav-button"
                  onClick={() =>
                    setActiveView(item.id)
                  }
                  style={{
                    ...styles.navButton,
                    ...(active
                      ? styles.navButtonActive
                      : {}),
                  }}
                >
                  <span style={styles.navNumber}>
                    {item.number}
                  </span>

                  {item.label}
                </button>
              );
            })}
          </nav>

          <div style={styles.sidebarBottom}>
            <Link
              to="/aset"
              target="_blank"
              rel="noreferrer"
              style={styles.sidebarLink}
            >
              VIEW ASET â†—
            </Link>

            <Link
              to="/aset/issues/issue-001"
              target="_blank"
              rel="noreferrer"
              style={styles.sidebarLinkMuted}
            >
              ISSUE 001 â†—
            </Link>

            <Link
              to="/admin"
              style={styles.sidebarLinkMuted}
            >
              STUDIO ADMIN
            </Link>
          </div>
        </aside>

        <section
          className="aset-admin-main"
          style={styles.main}
        >
          <div style={styles.topbar}>
            <span>THE ASET STUDIO</span>

            <span style={styles.topbarMode}>
              LOCAL EDITORIAL MODE Â· AUTO SAVED
            </span>
          </div>

          {activeView === "dashboard" && (
            <DashboardView
              articles={articles}
              issues={issues}
              categories={categories}
              contributors={contributors}
              setActiveView={setActiveView}
              openNewArticle={openNewArticle}
              openEditArticle={openEditArticle}
            />
          )}

          {activeView === "articles" && (
            <ArticlesView
              articles={articles}
              openNewArticle={openNewArticle}
              openEditArticle={openEditArticle}
              deleteArticle={deleteArticle}
            />
          )}

          {activeView === "issues" && (
            <IssuesView
              issues={issues}
              articles={articles}
              openIssueEditor={openIssueEditor}
            />
          )}

          {activeView === "categories" && (
            <CategoriesView
              categories={categories}
              setCategories={setCategories}
              articles={articles}
            />
          )}

          {activeView === "contributors" && (
            <ContributorsView
              contributors={contributors}
              articles={articles}
              openContributorEditor={
                openContributorEditor
              }
              deleteContributor={
                deleteContributor
              }
            />
          )}

          {activeView === "submissions" && (
            <SubmissionsView
              submissions={submissions}
              openSubmissionEditor={
                openSubmissionEditor
              }
              deleteSubmission={
                deleteSubmission
              }
              convertSubmissionToArticle={
                convertSubmissionToArticle
              }
            />
          )}
        </section>
      </div>

      {articleEditorOpen && (
        <ArticleEditor
          article={editingArticle}
          categories={categories}
          issues={issues}
          contributors={contributors}
          onClose={closeArticleEditor}
          onSave={saveArticle}
        />
      )}

      {submissionEditorOpen && (
        <SubmissionEditor
          submission={editingSubmission}
          categories={categories}
          issues={issues}
          onClose={closeSubmissionEditor}
          onSave={saveSubmission}
        />
      )}

      {issueEditorOpen && (
        <IssueEditor
          issue={editingIssue}
          articles={articles}
          onClose={closeIssueEditor}
          onSave={saveIssue}
        />
      )}

      {contributorEditorOpen && (
        <ContributorEditor
          contributor={editingContributor}
          onClose={closeContributorEditor}
          onSave={saveContributor}
        />
      )}
    </main>
  );
}
/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: COLORS.cream,
    color: COLORS.black,
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
  },

  shell: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "240px minmax(0,1fr)",
  },

  sidebar: {
    minHeight: "100vh",
    position: "sticky",
    top: 0,
    alignSelf: "start",
    padding: "34px 22px",
    background: COLORS.black,
    color: COLORS.cream,
    display: "flex",
    flexDirection: "column",
  },

  sidebarBrand: {
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "48px",
    letterSpacing: "-3px",
    lineHeight: 0.85,
  },

  sidebarSubtitle: {
    marginTop: "11px",
    color: "rgba(244,239,230,.46)",
    fontSize: "7px",
    letterSpacing: "2.4px",
    fontWeight: 900,
  },

  sidebarNav: {
    marginTop: "42px",
    display: "grid",
    gap: "5px",
  },

  navButton: {
    width: "100%",
    padding: "13px 12px",
    border: 0,
    background: "transparent",
    color: "rgba(244,239,230,.64)",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    fontSize: "9px",
    letterSpacing: "1.2px",
    fontWeight: 800,
  },

  navButtonActive: {
    background: COLORS.sapphire,
    color: COLORS.cream,
  },

  navNumber: {
    minWidth: "20px",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "13px",
  },

  sidebarBottom: {
    marginTop: "auto",
    paddingTop: "35px",
    display: "grid",
    gap: "14px",
  },

  sidebarLink: {
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  sidebarLinkMuted: {
    color: "rgba(244,239,230,.4)",
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  main: {
    minWidth: 0,
    padding: "32px 5% 80px",
  },

  topbar: {
    paddingBottom: "17px",
    marginBottom: "48px",
    borderBottom: `1px solid ${COLORS.line}`,
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  topbarMode: {
    color: COLORS.sapphire,
  },

  welcome: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto",
    gap: "40px",
    alignItems: "end",
    marginBottom: "42px",
  },

  eyebrow: {
    color: COLORS.sapphire,
    fontSize: "7px",
    letterSpacing: "2.4px",
    fontWeight: 900,
  },

  darkEyebrow: {
    color: "rgba(244,239,230,.65)",
    fontSize: "7px",
    letterSpacing: "2.2px",
    fontWeight: 900,
  },

  pageTitle: {
    margin: "10px 0 16px",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "clamp(48px,6vw,78px)",
    lineHeight: 0.84,
    letterSpacing: "-3px",
    fontWeight: 400,
  },

  pageIntro: {
    maxWidth: "600px",
    margin: 0,
    color: COLORS.muted,
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "16px",
    lineHeight: 1.6,
  },

  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
  },

  primaryButton: {
    border: 0,
    background: COLORS.sapphire,
    color: COLORS.cream,
    padding: "13px 18px",
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  outlineButton: {
    border: `1px solid ${COLORS.black}`,
    background: "transparent",
    color: COLORS.black,
    padding: "12px 18px",
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.8px",
    fontWeight: 900,
  },

  blackButton: {
    display: "inline-flex",
    marginTop: "24px",
    padding: "11px 15px",
    background: COLORS.black,
    color: COLORS.cream,
    textDecoration: "none",
    fontSize: "7px",
    letterSpacing: "1.6px",
    fontWeight: 900,
  },

  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    gap: "12px",
    marginBottom: "45px",
  },

  metricCard: {
    minHeight: "150px",
    padding: "20px",
    background: COLORS.creamSoft,
    border: `1px solid ${COLORS.line}`,
    display: "flex",
    flexDirection: "column",
  },

  metricCardDark: {
    background: COLORS.black,
    borderColor: COLORS.black,
  },

  metricLabel: {
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  metricValue: {
    marginTop: "auto",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "48px",
    lineHeight: 0.9,
  },

  metricDetail: {
    marginTop: "7px",
    fontSize: "9px",
  },

  dashboardGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0,1.55fr) minmax(260px,.65fr)",
    gap: "20px",
  },

  panel: {
    padding: "25px",
    background: COLORS.creamSoft,
    border: `1px solid ${COLORS.line}`,
  },

  sideStack: {
    display: "grid",
    gap: "20px",
    alignContent: "start",
  },

  sectionHeading: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "25px",
    paddingBottom: "15px",
    marginBottom: "24px",
    borderBottom: `1px solid ${COLORS.line}`,
  },

  sectionTitle: {
    margin: "5px 0 0",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "clamp(35px,4vw,52px)",
    lineHeight: 0.9,
    fontWeight: 400,
    letterSpacing: "-1.5px",
  },

  textButton: {
    padding: 0,
    border: 0,
    background: "transparent",
    color: COLORS.sapphire,
    fontSize: "7px",
    letterSpacing: "1.6px",
    fontWeight: 900,
  },

  recentArticle: {
    width: "100%",
    padding: "14px 0",
    border: 0,
    borderBottom: `1px solid ${COLORS.line}`,
    background: "transparent",
    color: COLORS.black,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  smallBlue: {
    color: COLORS.sapphire,
    fontSize: "6px",
    letterSpacing: "1.7px",
    fontWeight: 900,
    textTransform: "uppercase",
  },

  smallMuted: {
    marginTop: "5px",
    color: COLORS.muted,
    fontSize: "8px",
  },

  recentTitle: {
    marginTop: "4px",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "20px",
    lineHeight: 1.05,
  },

  statusBadge: {
    display: "inline-flex",
    justifyContent: "center",
    whiteSpace: "nowrap",
    padding: "6px 9px",
    fontSize: "6px",
    letterSpacing: "1.2px",
    fontWeight: 900,
    textTransform: "uppercase",
  },

  currentIssue: {
    padding: "28px",
    background: COLORS.sapphire,
    color: COLORS.cream,
  },

  bigIssueNumber: {
    marginTop: "28px",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "55px",
    lineHeight: 0.8,
  },

  currentIssueTitle: {
    margin: "14px 0 6px",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "29px",
    lineHeight: 0.95,
    fontWeight: 400,
  },

  issueDate: {
    color: "rgba(244,239,230,.68)",
    fontSize: "9px",
  },

  quickPanel: {
    padding: "22px",
    border: `1px solid ${COLORS.line}`,
  },

  quickTitle: {
    margin: "0 0 10px",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "25px",
    fontWeight: 400,
  },

  quickAction: {
    width: "100%",
    border: 0,
    borderBottom: `1px solid ${COLORS.line}`,
    background: "transparent",
    padding: "12px 0",
    display: "flex",
    justifyContent: "space-between",
    color: COLORS.black,
    textAlign: "left",
    fontSize: "10px",
  },

  toolbar: {
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  searchInput: {
    width: "min(420px,100%)",
    padding: "12px 14px",
    border: `1px solid ${COLORS.line}`,
    background: COLORS.creamSoft,
    color: COLORS.black,
    outline: "none",
    fontSize: "11px",
  },

  filterSelect: {
    padding: "12px 14px",
    border: `1px solid ${COLORS.line}`,
    background: COLORS.creamSoft,
    color: COLORS.black,
    outline: "none",
    fontSize: "10px",
  },

  resultCount: {
    marginLeft: "auto",
    color: COLORS.muted,
    fontSize: "7px",
    letterSpacing: "1.5px",
    fontWeight: 900,
  },

  tableWrap: {
    width: "100%",
    background: COLORS.creamSoft,
    border: `1px solid ${COLORS.line}`,
  },

  table: {
    width: "100%",
    minWidth: "1000px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "12px 14px",
    borderBottom: `1px solid ${COLORS.line}`,
    textAlign: "left",
    color: COLORS.muted,
    fontSize: "6px",
    letterSpacing: "1.5px",
  },

  td: {
    padding: "14px",
    borderBottom: `1px solid ${COLORS.line}`,
    verticalAlign: "middle",
    fontSize: "10px",
  },

  tableTitle: {
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "17px",
  },

  tableSlug: {
    marginTop: "3px",
    color: COLORS.muted,
    fontSize: "7px",
  },

  tableActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "6px",
  },

  editButton: {
    border: `1px solid ${COLORS.line}`,
    background: "transparent",
    color: COLORS.black,
    padding: "8px 11px",
    fontSize: "6px",
    letterSpacing: "1.4px",
    fontWeight: 900,
  },

  deleteButton: {
    border: `1px solid rgba(139,46,46,.25)`,
    background: "transparent",
    color: COLORS.red,
    padding: "8px 11px",
    fontSize: "6px",
    letterSpacing: "1.2px",
    fontWeight: 900,
  },

  previewButton: {
    display: "inline-flex",
    alignItems: "center",
    border: 0,
    background: COLORS.sapphire,
    color: COLORS.cream,
    padding: "8px 11px",
    textDecoration: "none",
    fontSize: "6px",
    letterSpacing: "1.2px",
    fontWeight: 900,
  },

  flagStack: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },

  flag: {
    padding: "4px 6px",
    background: "rgba(4,45,112,.09)",
    color: COLORS.sapphire,
    fontSize: "5px",
    letterSpacing: "1px",
    fontWeight: 900,
  },

  emptyTable: {
    padding: "40px",
    textAlign: "center",
    color: COLORS.muted,
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "18px",
  },

  issueGrid: {
    display: "grid",
    gap: "20px",
  },

  issueCard: {
    display: "grid",
    gridTemplateColumns: "200px minmax(0,1fr)",
    background: COLORS.creamSoft,
    border: `1px solid ${COLORS.line}`,
  },

  issueCover: {
    minHeight: "270px",
    padding: "18px",
    background: COLORS.sapphire,
    color: COLORS.cream,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  issueCoverLogo: {
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "38px",
    lineHeight: 0.8,
  },

  issueCoverCenter: {
    textAlign: "center",
  },

  issueCoverNumber: {
    marginTop: "6px",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "39px",
  },

  issueCoverFooter: {
    fontSize: "6px",
    letterSpacing: "1.4px",
    lineHeight: 1.7,
    fontWeight: 900,
  },

  issueContent: {
    padding: "28px",
    display: "flex",
    flexDirection: "column",
  },

  issueAdminTitle: {
    margin: "8px 0",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "38px",
    lineHeight: 0.95,
    fontWeight: 400,
  },

  issueDescription: {
    maxWidth: "650px",
    color: COLORS.muted,
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "14px",
    lineHeight: 1.55,
  },

  issueStats: {
    marginTop: "15px",
    paddingTop: "18px",
    borderTop: `1px solid ${COLORS.line}`,
    display: "grid",
    gap: "10px",
    fontSize: "9px",
  },

  issueActions: {
    marginTop: "auto",
    paddingTop: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  categoryCreator: {
    maxWidth: "700px",
    marginBottom: "25px",
    display: "flex",
    gap: "10px",
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "10px",
  },

  categoryCard: {
    minHeight: "90px",
    padding: "17px",
    border: `1px solid ${COLORS.line}`,
    background: COLORS.creamSoft,
    display: "grid",
    gridTemplateColumns: "40px minmax(0,1fr) auto",
    alignItems: "center",
    gap: "12px",
  },

  categoryNumber: {
    color: COLORS.sapphire,
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "20px",
  },

  categoryName: {
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "21px",
  },

  removeButton: {
    border: 0,
    background: "transparent",
    color: COLORS.muted,
    fontSize: "6px",
    letterSpacing: "1.2px",
    fontWeight: 900,
  },

  contributorGrid: {
    display: "grid",
    gap: "10px",
  },

  contributorCard: {
    padding: "18px",
    background: COLORS.creamSoft,
    border: `1px solid ${COLORS.line}`,
    display: "grid",
    gridTemplateColumns:
      "55px minmax(0,1fr) auto auto",
    gap: "15px",
    alignItems: "center",
  },

  contributorInitial: {
    width: "55px",
    height: "55px",
    background: COLORS.sapphire,
    color: COLORS.cream,
    display: "grid",
    placeItems: "center",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "26px",
  },

  contributorName: {
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "22px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    padding: "30px 15px",
    background: "rgba(5,5,5,.78)",
    display: "grid",
    placeItems: "center",
  },

  editorModal: {
    width: "min(960px,94vw)",
    maxHeight: "90vh",
    overflowY: "auto",
    background: COLORS.cream,
    boxShadow: "0 30px 90px rgba(0,0,0,.4)",
  },

  smallModal: {
    width: "min(700px,94vw)",
    maxHeight: "90vh",
    overflowY: "auto",
    background: COLORS.cream,
    boxShadow: "0 30px 90px rgba(0,0,0,.4)",
  },

  modalHeader: {
    padding: "24px 28px",
    background: COLORS.black,
    color: COLORS.cream,
    display: "flex",
    justifyContent: "space-between",
    gap: "25px",
  },

  modalTitle: {
    margin: "6px 0 0",
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "38px",
    lineHeight: 1,
    fontWeight: 400,
  },

  closeButton: {
    alignSelf: "flex-start",
    border: 0,
    background: "transparent",
    color: COLORS.cream,
    fontFamily: '"Times New Roman", Georgia, serif',
    fontSize: "35px",
    lineHeight: 0.8,
  },

  editorForm: {
    padding: "28px",
    display: "grid",
    gap: "22px",
  },

  formSection: {
    display: "grid",
    gap: "16px",
  },

  formSectionTitle: {
    paddingBottom: "9px",
    borderBottom: `1px solid ${COLORS.line}`,
    color: COLORS.black,
    fontSize: "7px",
    letterSpacing: "2px",
    fontWeight: 900,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "15px",
  },

  field: {
    display: "grid",
    gap: "7px",
  },

  label: {
    color: COLORS.sapphire,
    fontSize: "7px",
    letterSpacing: "1.7px",
    fontWeight: 900,
  },

  input: {
    width: "100%",
    padding: "12px 13px",
    border: `1px solid ${COLORS.line}`,
    background: COLORS.creamSoft,
    color: COLORS.black,
    outline: "none",
  },

  slugField: {
    display: "flex",
    alignItems: "stretch",
    border: `1px solid ${COLORS.line}`,
    background: COLORS.creamSoft,
  },

  slugPrefix: {
    padding: "12px 0 12px 13px",
    color: COLORS.muted,
    fontSize: "10px",
    whiteSpace: "nowrap",
  },

  slugInput: {
    flex: 1,
    minWidth: 0,
    padding: "12px 13px 12px 2px",
    border: 0,
    outline: "none",
    background: "transparent",
    color: COLORS.black,
  },

  optionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "10px",
  },

  optionCard: {
    padding: "16px",
    border: `1px solid ${COLORS.line}`,
    background: COLORS.creamSoft,
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "10px",
  },

  imagePreview: {
    maxWidth: "420px",
    border: `1px solid ${COLORS.line}`,
    background: COLORS.black,
  },

  imagePreviewImg: {
    display: "block",
    width: "100%",
    maxHeight: "260px",
    objectFit: "cover",
  },

  localNotice: {
    padding: "14px",
    borderLeft: `4px solid ${COLORS.sapphire}`,
    background: "rgba(4,45,112,.08)",
    color: COLORS.muted,
    fontSize: "9px",
    lineHeight: 1.55,
  },

  modalActions: {
    paddingTop: "18px",
    borderTop: `1px solid ${COLORS.line}`,
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  cancelButton: {
    padding: "12px 17px",
    border: `1px solid ${COLORS.black}`,
    background: "transparent",
    color: COLORS.black,
    fontSize: "7px",
    letterSpacing: "1.6px",
    fontWeight: 900,
  },
};

export default AdminAsetPage;


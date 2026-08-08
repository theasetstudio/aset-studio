import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../components/cinema/VideosPage.css";

import CinemaHero from "../components/cinema/CinemaHero";
import FeaturedPremiere from "../components/cinema/FeaturedPremiere";
import CinemaToolbar from "../components/cinema/CinemaToolbar";
import CinemaRow from "../components/cinema/CinemaRow";
import CinemaCollectionHub from "../components/cinema/CinemaCollectionHub";
import ComingSoon from "../components/cinema/ComingSoon";
import CinemaManifesto from "../components/cinema/CinemaManifesto";

import {
  CinemaEmpty,
  CinemaError,
  CinemaLoading,
} from "../components/cinema/CinemaStatus";

import {
  ENTERTAINMENT_COLLECTION,
  FILTER_OPTIONS,
  INTERVIEW_COLLECTION,
  PRIMARY_ROWS,
  UPCOMING_TERMS,
} from "../components/cinema/cinemaConfig";

import {
  SIGNED_URL_TTL_SECONDS,
  clean,
  getMediaPath,
  isApprovedForCinema,
  isGalleryOnly,
  isVideoFile,
  matches,
  norm,
  roomMatches,
  textPool,
  uniqueItems,
} from "../components/cinema/cinemaUtils";

const CONTINUE_WATCHING_LIMIT = 10;
const COMPLETION_PERCENTAGE = 0.95;
const MINIMUM_PROGRESS_SECONDS = 2;

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default function VideosPage() {
  const [session, setSession] = useState(null);

  const [cinemaItems, setCinemaItems] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});

  const [watchHistory, setWatchHistory] = useState([]);
  const [loadingWatchHistory, setLoadingWatchHistory] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [activeFilter, setActiveFilter] = useState("All Cinema");
  const [searchQuery, setSearchQuery] = useState("");
  const [mutedHero, setMutedHero] = useState(true);

  const libraryRef = useRef(null);

  const userId = session?.user?.id || null;

  const getSignedUrl = useCallback(async (path) => {
    const cleanPath = clean(path).replace(/^\/+/, "");

    if (!cleanPath) {
      return "";
    }

    try {
      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(
          cleanPath,
          SIGNED_URL_TTL_SECONDS
        );

      if (error) {
        console.error(
          "The Aset Cinema signed URL error:",
          cleanPath,
          error
        );

        return "";
      }

      return data?.signedUrl || "";
    } catch (error) {
      console.error(
        "The Aset Cinema signed URL request failed:",
        cleanPath,
        error
      );

      return "";
    }
  }, []);

  /*
   * Load the signed-in session.
   * Continue Watching remains private to the current account.
   */
  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(currentSession || null);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!mounted) {
          return;
        }

        setSession(nextSession || null);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  /*
   * Load all published Cinema videos.
   */
  const loadCinemaItems = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("status", "published")
        .eq("is_hidden", false)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      const publishedItems = Array.isArray(data)
        ? data
        : [];

      const publishedVideos = publishedItems.filter(
        (item) => {
          const mediaPath = getMediaPath(item);

          return (
            Boolean(mediaPath) &&
            isVideoFile(mediaPath) &&
            !isGalleryOnly(item)
          );
        }
      );

      const explicitlyApprovedVideos =
        publishedVideos.filter((item) =>
          isApprovedForCinema(item)
        );

      /*
       * Older uploads may not contain newer Cinema flags.
       * If none are explicitly approved, display all valid videos.
       */
      const selectedCinemaItems =
        explicitlyApprovedVideos.length > 0
          ? explicitlyApprovedVideos
          : publishedVideos;

      const signedEntries = await Promise.all(
        selectedCinemaItems.map(async (item) => {
          const mediaPath = getMediaPath(item);
          const signedUrl = await getSignedUrl(mediaPath);

          return [item.id, signedUrl];
        })
      );

      setCinemaItems(selectedCinemaItems);
      setPreviewUrls(
        Object.fromEntries(signedEntries)
      );
    } catch (error) {
      console.error(
        "The Aset Cinema loading error:",
        error
      );

      setCinemaItems([]);
      setPreviewUrls({});
      setLoadError(
        "The cinema could not connect to the screening library. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [getSignedUrl]);

  useEffect(() => {
    loadCinemaItems();
  }, [loadCinemaItems]);

  /*
   * Load the current viewer's unfinished watch history.
   */
  const loadWatchHistory = useCallback(async () => {
    if (!userId) {
      setWatchHistory([]);
      return;
    }

    setLoadingWatchHistory(true);

    try {
      const { data, error } = await supabase
        .from("watch_history")
        .select(`
          media_id,
          progress_seconds,
          duration_seconds,
          completed,
          updated_at
        `)
        .eq("user_id", userId)
        .eq("completed", false)
        .order("updated_at", {
          ascending: false,
        })
        .limit(CONTINUE_WATCHING_LIMIT);

      if (error) {
        throw error;
      }

      const unfinishedHistory = (
        Array.isArray(data) ? data : []
      ).filter((historyItem) => {
        const progress = safeNumber(
          historyItem.progress_seconds
        );

        const duration = safeNumber(
          historyItem.duration_seconds
        );

        if (
          progress < MINIMUM_PROGRESS_SECONDS ||
          duration <= 0
        ) {
          return false;
        }

        return (
          progress / duration <
          COMPLETION_PERCENTAGE
        );
      });

      setWatchHistory(unfinishedHistory);
    } catch (error) {
      console.error(
        "Continue Watching load failed:",
        error
      );

      setWatchHistory([]);
    } finally {
      setLoadingWatchHistory(false);
    }
  }, [userId]);

  useEffect(() => {
    loadWatchHistory();
  }, [loadWatchHistory]);

  /*
   * Reload Continue Watching when the viewer returns
   * to the browser tab after watching something.
   */
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadWatchHistory();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [loadWatchHistory]);

  const featuredPremiere = useMemo(() => {
    if (!cinemaItems.length) {
      return null;
    }

    const explicitlyFeatured = cinemaItems.find(
      (item) =>
        item?.featured === true ||
        item?.is_featured === true ||
        item?.homepage_featured === true ||
        matches(item, [
          "featured premiere",
          "featured screening",
          "premiere feature",
        ])
    );

    return explicitlyFeatured || cinemaItems[0];
  }, [cinemaItems]);

  const featuredUrl = featuredPremiere
    ? previewUrls[featuredPremiere.id] || ""
    : "";

  /*
   * Match watch-history rows with their media records.
   */
  const continueWatchingItems = useMemo(() => {
    if (!watchHistory.length) {
      return [];
    }

    const mediaById = new Map(
      cinemaItems.map((item) => [
        String(item.id),
        item,
      ])
    );

    return watchHistory
      .map((historyItem) => {
        const mediaItem = mediaById.get(
          String(historyItem.media_id)
        );

        if (!mediaItem) {
          return null;
        }

        const progressSeconds = safeNumber(
          historyItem.progress_seconds
        );

        const durationSeconds = safeNumber(
          historyItem.duration_seconds
        );

        const progressPercentage =
          durationSeconds > 0
            ? Math.min(
                100,
                Math.max(
                  0,
                  (progressSeconds /
                    durationSeconds) *
                    100
                )
              )
            : 0;

        return {
          ...mediaItem,

          watch_progress_seconds:
            progressSeconds,

          watch_duration_seconds:
            durationSeconds,

          watch_progress_percentage:
            progressPercentage,

          watch_updated_at:
            historyItem.updated_at,
        };
      })
      .filter(Boolean);
  }, [cinemaItems, watchHistory]);

  const continueWatchingRoom = useMemo(() => {
    return {
      key: "continue-watching",
      title: "Continue Watching",
      icon: "▶",
      subtitle: "PICK UP WHERE YOU LEFT OFF",
      description:
        "Resume unfinished films, interviews, performances, and Aset Cinema presentations across your signed-in devices.",
      items: continueWatchingItems,
    };
  }, [continueWatchingItems]);

  const filteredCinemaItems = useMemo(() => {
    let filtered = [...cinemaItems];

    if (activeFilter === "Real Cinema") {
      filtered = filtered.filter(
        (item) =>
          matches(item, [
            "real cinema",
            "live action",
            "live-action",
            "independent film",
            "traditional film",
            "documentary",
            "short film",
            "feature film",
            "movie",
          ]) &&
          !matches(item, [
            "ai cinema",
            "ai film",
            "ai series",
            "virtual production",
            "generative film",
            "synthetic cinema",
          ])
      );
    }

    if (activeFilter === "AI Cinema") {
      filtered = filtered.filter((item) =>
        matches(item, [
          "ai cinema",
          "ai film",
          "ai series",
          "virtual production",
          "generative film",
          "synthetic cinema",
          "artificial intelligence",
        ])
      );
    }

    if (activeFilter === "Interviews") {
      filtered = filtered.filter((item) =>
        matches(item, [
          "interview",
          "conversation",
          "cast interview",
          "director interview",
          "creator interview",
          "spotlight interview",
          "behind the lens",
          "director commentary",
        ])
      );
    }

    if (activeFilter === "Performances") {
      filtered = filtered.filter((item) =>
        matches(item, [
          "performance",
          "performance room",
          "monologue",
          "spoken word",
          "live session",
          "music video",
          "comedy",
          "stand-up",
          "stand up",
          "sketch",
          "audition",
          "scene study",
        ])
      );
    }

    const query = norm(searchQuery);

    if (query) {
      filtered = filtered.filter((item) =>
        textPool(item).includes(query)
      );
    }

    return uniqueItems(filtered);
  }, [
    activeFilter,
    cinemaItems,
    searchQuery,
  ]);

  const primaryRows = useMemo(() => {
    return PRIMARY_ROWS.map((row) => {
      const rowItems =
        row.mode === "recent"
          ? uniqueItems(
              filteredCinemaItems
            ).slice(0, 10)
          : roomMatches(
              filteredCinemaItems,
              row.terms || []
            );

      return {
        ...row,
        items: rowItems,
      };
    }).filter((row) => row.items.length > 0);
  }, [filteredCinemaItems]);

  const buildCollection = useCallback(
    (collection) => {
      return {
        ...collection,

        rooms: collection.rooms.map(
          (room) => ({
            ...room,

            items: roomMatches(
              filteredCinemaItems,
              room.terms || []
            ),
          })
        ),
      };
    },
    [filteredCinemaItems]
  );

  const interviewsCollection = useMemo(
    () =>
      buildCollection(
        INTERVIEW_COLLECTION
      ),
    [buildCollection]
  );

  const entertainmentCollection = useMemo(
    () =>
      buildCollection(
        ENTERTAINMENT_COLLECTION
      ),
    [buildCollection]
  );

  const upcomingItems = useMemo(() => {
    return roomMatches(
      filteredCinemaItems,
      UPCOMING_TERMS || []
    );
  }, [filteredCinemaItems]);

  const interviewsCount = useMemo(() => {
    return interviewsCollection.rooms.reduce(
      (total, room) =>
        total + room.items.length,
      0
    );
  }, [interviewsCollection]);

  const entertainmentCount = useMemo(() => {
    return entertainmentCollection.rooms.reduce(
      (total, room) =>
        total + room.items.length,
      0
    );
  }, [entertainmentCollection]);

  const hasVisibleContent =
    continueWatchingItems.length > 0 ||
    primaryRows.length > 0 ||
    interviewsCount > 0 ||
    entertainmentCount > 0 ||
    upcomingItems.length > 0;

  function scrollToLibrary() {
    libraryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function scrollRoom(direction, roomId) {
    const row =
      document.getElementById(roomId);

    if (!row) {
      return;
    }

    const amount = Math.max(
      row.clientWidth * 0.75,
      280
    );

    row.scrollBy({
      left:
        direction === "left"
          ? -amount
          : amount,

      behavior: "smooth",
    });
  }

  function resetFilters() {
    setSearchQuery("");
    setActiveFilter("All Cinema");
  }

  return (
    <main className="videos-page">
      <CinemaHero
        featuredPremiere={featuredPremiere}
        featuredUrl={featuredUrl}
        mutedHero={mutedHero}
        onToggleMute={() =>
          setMutedHero(
            (current) => !current
          )
        }
        onExplore={scrollToLibrary}
      />

      <FeaturedPremiere
        item={featuredPremiere}
        previewUrl={featuredUrl}
      />

      <section
        className="cinema-library"
        ref={libraryRef}
        id="cinema-library"
      >
        <div className="cinema-library-heading">
          <div>
            <p>NOW SCREENING</p>

            <h2>
              Explore The Aset Cinema
            </h2>

            <span>
              Real cinema, AI storytelling,
              interviews, music, performance,
              comedy, commentary, premieres,
              and original productions.
            </span>
          </div>

          <Link
            to="/"
            className="cinema-return-link"
          >
            Return to The Aset Studio →
          </Link>
        </div>

        <CinemaToolbar
          filterOptions={FILTER_OPTIONS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() =>
            setSearchQuery("")
          }
        />

        {loading && <CinemaLoading />}

        {!loading && loadError && (
          <CinemaError
            message={loadError}
            onRetry={loadCinemaItems}
          />
        )}

        {!loading &&
          !loadError &&
          hasVisibleContent && (
            <div className="cinema-premium-layout">
              {userId &&
                loadingWatchHistory && (
                  <div className="videos-loading">
                    <span className="cinema-loader" />
                    Preparing Continue Watching...
                  </div>
                )}

              {userId &&
                !loadingWatchHistory &&
                continueWatchingItems.length >
                  0 && (
                  <div className="cinema-continue-watching-section">
                    <CinemaRow
                      room={continueWatchingRoom}
                      previewUrls={previewUrls}
                      onScroll={scrollRoom}
                    />
                  </div>
                )}

              {primaryRows.length > 0 && (
                <div className="cinema-rooms-list">
                  {primaryRows.map(
                    (room) => (
                      <CinemaRow
                        key={
                          room.key ||
                          room.title
                        }
                        room={room}
                        previewUrls={
                          previewUrls
                        }
                        onScroll={
                          scrollRoom
                        }
                      />
                    )
                  )}
                </div>
              )}

              {interviewsCount > 0 && (
                <CinemaCollectionHub
                  collection={
                    interviewsCollection
                  }
                  previewUrls={
                    previewUrls
                  }
                />
              )}

              {entertainmentCount > 0 && (
                <CinemaCollectionHub
                  collection={
                    entertainmentCollection
                  }
                  previewUrls={
                    previewUrls
                  }
                />
              )}

              <ComingSoon
                items={upcomingItems}
                previewUrls={previewUrls}
              />
            </div>
          )}

        {!loading &&
          !loadError &&
          !hasVisibleContent && (
            <CinemaEmpty
              onReset={resetFilters}
            />
          )}
      </section>

      <CinemaManifesto />
    </main>
  );
}
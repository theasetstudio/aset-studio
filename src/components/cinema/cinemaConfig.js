export const FILTER_OPTIONS = [
  "All Cinema",
  "Real Cinema",
  "AI Cinema",
  "Interviews",
  "Performances",
];

export const PRIMARY_ROWS = [
  {
    key: "recently-added",
    title: "Recently Added",
    icon: "🆕",
    subtitle: "FRESH IN THE CINEMA",
    description:
      "The newest films, interviews, performances, releases, and visual stories entering The Aset Cinema.",
    mode: "recent",
  },

  {
    key: "aset-originals",
    title: "Aset Originals",
    icon: "⭐",
    subtitle: "ORIGINAL PRODUCTIONS",
    description:
      "Original films, series, interviews, and cinematic experiences created or presented by The Aset Studio.",
    terms: [
      "aset original",
      "aset originals",
      "studio original",
      "studio originals",
      "studio release",
      "original production",
      "original film",
      "original series",
    ],
  },

  {
    key: "cinematic-releases",
    title: "Cinematic Releases",
    icon: "🎬",
    subtitle: "FEATURED CINEMA",
    description:
      "Curated films, shorts, premieres, official screenings, and cinematic presentations.",
    terms: [
      "cinematic release",
      "cinema release",
      "cinematic",
      "official screening",
      "screening",
      "premiere",
      "studio release",
    ],
  },

  {
    key: "films",
    title: "Films",
    icon: "🎥",
    subtitle: "FEATURE FILMS & SHORTS",
    description:
      "Feature films, short films, independent cinema, live-action stories, AI films, and hybrid productions.",
    terms: [
      "film",
      "movie",
      "short film",
      "feature film",
      "independent film",
      "ai film",
      "live action",
      "live-action",
      "cinematic story",
    ],
  },

  {
    key: "ai-cinema",
    title: "AI Cinema",
    icon: "✦",
    subtitle: "NEXT-GENERATION STORYTELLING",
    description:
      "AI-powered films, virtual productions, digital worlds, original characters, and experimental cinema.",
    terms: [
      "ai cinema",
      "ai film",
      "ai movie",
      "ai series",
      "ai soap opera",
      "virtual production",
      "generative film",
      "synthetic cinema",
      "artificial intelligence",
    ],
  },

  {
    key: "teasers-and-trailers",
    title: "Teasers & Trailers",
    icon: "🎞",
    subtitle: "FIRST LOOKS",
    description:
      "Official trailers, teasers, previews, announcements, sneak peeks, and first looks.",
    terms: [
      "trailer",
      "teaser",
      "first look",
      "sneak peek",
      "preview",
      "official trailer",
      "announcement trailer",
    ],
  },

  {
    key: "interviews",
    title: "Interviews",
    icon: "🎭",
    subtitle: "REAL VOICES",
    description:
      "Conversations with actors, filmmakers, artists, managers, creators, and industry professionals.",
    terms: [
      "interview",
      "conversation",
      "private conversation",
      "industry conversation",
      "spotlight interview",
      "creator interview",
      "director interview",
      "artist interview",
      "manager interview",
    ],
  },

  {
    key: "cast-interviews",
    title: "Cast Interviews",
    icon: "🎭",
    subtitle: "MEET THE CAST",
    description:
      "Cast conversations, character discussions, ensemble features, reactions, and production reflections.",
    terms: [
      "cast interview",
      "meet the cast",
      "actor interview",
      "ensemble interview",
      "character interview",
      "cast conversation",
      "cast reaction",
    ],
  },

  {
    key: "behind-the-lens",
    title: "Behind the Lens",
    icon: "🎥",
    subtitle: "THE STORY AROUND THE STORY",
    description:
      "Behind-the-scenes features, production moments, filming highlights, set tours, and creative conversations.",
    terms: [
      "behind the lens",
      "behind the scenes",
      "behind-the-scenes",
      "production feature",
      "creative feature",
      "filmmaker feature",
      "on set",
      "set tour",
      "filming",
      "production diary",
    ],
  },

  {
    key: "director-commentary",
    title: "Director Commentary",
    icon: "🎬",
    subtitle: "THE VISION EXPLAINED",
    description:
      "Directors and creators discuss hidden details, character choices, themes, scenes, and creative decisions.",
    terms: [
      "director commentary",
      "creator commentary",
      "filmmaker commentary",
      "scene commentary",
      "director discussion",
      "episode breakdown",
      "hidden details",
      "creative choices",
      "story analysis",
    ],
  },

  {
    key: "studio-outtakes",
    title: "Studio Outtakes",
    icon: "😂",
    subtitle: "UNSCRIPTED MOMENTS",
    description:
      "Bloopers, missed takes, cast laughs, unexpected moments, and memorable clips outside the final cut.",
    terms: [
      "studio outtake",
      "studio outtakes",
      "outtake",
      "outtakes",
      "blooper",
      "bloopers",
      "missed take",
      "missed takes",
      "cast laughs",
      "funny moment",
    ],
  },

  {
    key: "performance-room",
    title: "Performance Room",
    icon: "🎤",
    subtitle: "THE STAGE IS OPEN",
    description:
      "Monologues, scene readings, spoken word, live sessions, dramatic performances, and creative showcases.",
    terms: [
      "performance room",
      "performance",
      "monologue",
      "spoken word",
      "live session",
      "acting",
      "audition",
      "character read",
      "script reading",
      "scene study",
      "self tape",
      "self-tape",
    ],
  },

  {
    key: "music-videos",
    title: "Music Videos",
    icon: "🎵",
    subtitle: "MUSIC IN MOTION",
    description:
      "Official music videos, performance visuals, cinematic songs, artist presentations, and visualizers.",
    terms: [
      "music video",
      "performance visual",
      "official video",
      "visualizer",
      "artist performance",
      "song video",
      "cinematic song",
    ],
  },

  {
    key: "comedy-corner",
    title: "Comedy Corner",
    icon: "😂",
    subtitle: "LAUGHTER LIVES HERE",
    description:
      "Stand-up, sketches, comedic performances, funny conversations, and original entertainment.",
    terms: [
      "comedy",
      "comedy corner",
      "stand up",
      "stand-up",
      "standup",
      "sketch",
      "comedian",
      "funny",
      "comedic performance",
    ],
  },

  {
    key: "hot-takes",
    title: "Hot Takes",
    icon: "🔥",
    subtitle: "COMMENTARY ROOM",
    description:
      "Bold opinions, reactions, entertainment conversations, reviews, and perspectives on culture.",
    terms: [
      "hot take",
      "hot takes",
      "reaction",
      "opinion",
      "review",
      "cultural commentary",
      "entertainment commentary",
    ],
  },

  {
    key: "red-carpet",
    title: "Red Carpet",
    icon: "🏆",
    subtitle: "PREMIERES & EVENTS",
    description:
      "Premieres, celebrations, award events, arrivals, festival coverage, and entertainment interviews.",
    terms: [
      "red carpet",
      "event coverage",
      "premiere event",
      "award",
      "awards",
      "festival",
      "arrival",
      "premiere interview",
    ],
  },

  {
    key: "coming-soon",
    title: "Coming Soon",
    icon: "🎞",
    subtitle: "THE NEXT SCREENING",
    description:
      "Upcoming films, series, trailers, interviews, announcements, and special presentations.",
    terms: [
      "coming soon",
      "upcoming",
      "in production",
      "future release",
      "announcement",
      "premiere soon",
      "releasing soon",
    ],
  },
];

export const INTERVIEW_COLLECTION = {
  title: "Interviews Collection",
  eyebrow: "REAL VOICES",
  description:
    "Conversations, cast features, production insight, and commentary from the people shaping each story.",
  rooms: [
    {
      title: "Interviews",
      icon: "🎭",
      terms: [
        "interview",
        "conversation",
        "creator interview",
        "director interview",
        "artist interview",
        "manager interview",
      ],
    },
    {
      title: "Cast Interviews",
      icon: "🎭",
      terms: [
        "cast interview",
        "meet the cast",
        "actor interview",
        "ensemble interview",
        "character interview",
      ],
    },
    {
      title: "Behind the Lens",
      icon: "🎥",
      terms: [
        "behind the lens",
        "behind the scenes",
        "behind-the-scenes",
        "production feature",
        "on set",
        "set tour",
      ],
    },
    {
      title: "Director Commentary",
      icon: "🎬",
      terms: [
        "director commentary",
        "creator commentary",
        "scene commentary",
        "episode breakdown",
        "hidden details",
      ],
    },
  ],
};

export const ENTERTAINMENT_COLLECTION = {
  title: "Entertainment Collection",
  eyebrow: "THE STAGE IS OPEN",
  description:
    "Performance, music, comedy, commentary, event coverage, and unforgettable studio moments.",
  rooms: [
    {
      title: "Performance Room",
      icon: "🎤",
      terms: [
        "performance room",
        "performance",
        "monologue",
        "spoken word",
        "live session",
        "acting",
        "audition",
        "scene study",
      ],
    },
    {
      title: "Music Videos",
      icon: "🎵",
      terms: [
        "music video",
        "performance visual",
        "official video",
        "visualizer",
        "artist performance",
      ],
    },
    {
      title: "Comedy Corner",
      icon: "😂",
      terms: [
        "comedy",
        "comedy corner",
        "stand up",
        "stand-up",
        "sketch",
        "comedian",
        "funny",
      ],
    },
    {
      title: "Studio Outtakes",
      icon: "🎞",
      terms: [
        "studio outtake",
        "studio outtakes",
        "outtake",
        "blooper",
        "bloopers",
        "missed take",
        "cast laughs",
      ],
    },
    {
      title: "Hot Takes",
      icon: "🔥",
      terms: [
        "hot take",
        "hot takes",
        "reaction",
        "opinion",
        "review",
        "cultural commentary",
      ],
    },
    {
      title: "Red Carpet",
      icon: "🏆",
      terms: [
        "red carpet",
        "event coverage",
        "premiere event",
        "award",
        "festival",
        "arrival",
      ],
    },
  ],
};

export const UPCOMING_TERMS = [
  "coming soon",
  "upcoming",
  "in production",
  "future release",
  "announcement",
  "premiere soon",
  "releasing soon",
  "trailer",
  "teaser",
  "first look",
  "sneak peek",
  "preview",
];
// ─── Static Asset Registry ────────────────────────────────────────────────────
// All require() calls live here. Components import from Images, never inline.
// Add assets to src/assets/images/ and register them here.

export const Images = {
  avatarPlaceholder: require('../../assets/images/avatar_placeholder.png'),
  coursePlaceholder: require('../../assets/images/course_placeholder.png'),
  // logoFull: require('../assets/images/logo_full.png'),
  // emptyBookmarks: require('../assets/images/empty_bookmarks.png'),
  // emptySearch: require('../assets/images/empty_search.png'),
  // offlineIllustration: require('../assets/images/offline.png'),
} as const;

export type ImageKey = keyof typeof Images;
export interface UserState {
  id: string | null;
  username: string;
  email: string;
  avatarUrl: string;
  isEmailVerified: boolean;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  hasSeenBookmarkMilestone: boolean;
}

export interface UserStats {
  enrolledCount: number;
  bookmarkCount: number;
}
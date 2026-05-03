import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Colors } from './colors';

export type IoniconsName = React.ComponentPropsWithoutRef<typeof Ionicons>['name'];

// ─── Named Icon Map ───────────────────────────────────────────────────────────
// Import ICON_NAMES — never hardcode icon string literals in components.
export const ICON_NAMES = {
  // Auth
  eye: 'eye-outline' as IoniconsName,
  eyeOff: 'eye-off-outline' as IoniconsName,
  person: 'person-outline' as IoniconsName,
  mail: 'mail-outline' as IoniconsName,
  lock: 'lock-closed-outline' as IoniconsName,

  // Tab nav
  home: 'home-outline' as IoniconsName,
  homeFilled: 'home' as IoniconsName,
  courses: 'book-outline' as IoniconsName,
  coursesFilled: 'book' as IoniconsName,
  bookmarks: 'bookmark-outline' as IoniconsName,
  bookmarksFilled: 'bookmark' as IoniconsName,
  profile: 'person-circle-outline' as IoniconsName,
  profileFilled: 'person-circle' as IoniconsName,

  // Actions
  search: 'search-outline' as IoniconsName,
  close: 'close-outline' as IoniconsName,
  back: 'arrow-back-outline' as IoniconsName,
  forward: 'arrow-forward-outline' as IoniconsName,
  refresh: 'refresh-outline' as IoniconsName,
  filter: 'options-outline' as IoniconsName,
  logout: 'log-out-outline' as IoniconsName,
  camera: 'camera-outline' as IoniconsName,
  download: 'download-outline' as IoniconsName,
  notifications: 'notifications-outline' as IoniconsName,
  notificationsFilled: 'notifications' as IoniconsName,
  more: 'ellipsis-horizontal-outline' as IoniconsName,
  edit: 'create-outline' as IoniconsName,
  share: 'share-social-outline' as IoniconsName,
  settings: 'settings-outline' as IoniconsName,
  check: 'checkmark-circle' as IoniconsName,
  checkOutline: 'checkmark-circle-outline' as IoniconsName,
  alert: 'alert-circle-outline' as IoniconsName,
  info: 'information-circle-outline' as IoniconsName,

  // Content
  star: 'star' as IoniconsName,
  starOutline: 'star-outline' as IoniconsName,
  time: 'time-outline' as IoniconsName,
  people: 'people-outline' as IoniconsName,
  play: 'play-circle-outline' as IoniconsName,
  web: 'globe-outline' as IoniconsName,
  trophy: 'trophy-outline' as IoniconsName,
  school: 'school-outline' as IoniconsName,

  // Network
  wifi: 'wifi-outline' as IoniconsName,
  wifiOff: 'cloud-offline-outline' as IoniconsName,
} as const;

export type IconName = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];

// ─── Reusable Icon Component ──────────────────────────────────────────────────
interface IconProps {
  name: IoniconsName;
  size?: number;
  color?: string;
  style?: object;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = Colors.textPrimary,
  style,
}) => React.createElement(Ionicons, { name, size, color, style });
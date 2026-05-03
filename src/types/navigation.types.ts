export type RootStackParamList = {
  // Auth stack
  '(auth)/login': undefined;
  '(auth)/register': undefined;

  // App tabs
  '(tabs)/index': undefined;
  '(tabs)/courses': undefined;
  '(tabs)/bookmarks': undefined;
  '(tabs)/profile': undefined;

  // Modals / push screens
  'courses/[id]': { id: string };
  'webview/course': { courseId: string; courseTitle: string };
};
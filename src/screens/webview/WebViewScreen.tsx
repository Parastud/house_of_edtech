import { useAppDispatch, useAppSelector } from '@/src/redux/hook';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { AppText } from '../../components/common/AppText';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useBookmarks } from '../../hooks/useBookmarks';
import { updateCourseEnrollment } from '../../redux/slices/course.slice';
import { showSnackbarError, showSnackbarSuccess } from '../../redux/slices/snackbar.slice';
import { Colors } from '../../theme/colors';
import { Icon } from '../../theme/icons';
import { loadEnrolledCourses, saveEnrolledCourses } from '../../utils/localStorageKey';
import { buildCourseWebViewHTML } from '../../utils/webviewTemplate';

type WebViewMessage =
  | { type: 'WEBVIEW_READY'; courseId: string }
  | { type: 'ENROLL'; courseId: string };

  export const WebViewScreen: React.FC = () => {
  const { courseId, courseTitle } = useLocalSearchParams<{
    courseId: string;
    courseTitle: string;
  }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const webViewRef = useRef<WebView>(null);
  const { isBookmarked } = useBookmarks();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const course = useAppSelector((s) =>
    s.courses.items.find((c : { id: string }) => c.id === courseId),
  );

  // ── When bookmark changes in native, push update to WebView ────────────
  const bookmarked = course ? isBookmarked(course.id) : false;

  const sendBookmarkUpdateToWebView = useCallback(
    (value: boolean) => {
      webViewRef.current?.injectJavaScript(
        `
        try {
          window.dispatchEvent(new MessageEvent('message', {
            data: JSON.stringify({ type: 'BOOKMARK_UPDATE', isBookmarked: ${value} })
          }));
        } catch(e) {}
        true;
        `,
      );
    },
    [],
  );

  // Sync bookmark state to WebView when it changes
  useEffect(() => {
    if (!isLoading) {
      sendBookmarkUpdateToWebView(bookmarked);
    }
  }, [bookmarked, isLoading]);

  // ── Handle messages from WebView → native ───────────────────────────────
  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data) as WebViewMessage;

        if (msg.type === 'WEBVIEW_READY') {
          // WebView is ready — send initial bookmark state
          sendBookmarkUpdateToWebView(bookmarked);
        }

        if (msg.type === 'ENROLL' && course) {
          dispatch(
            updateCourseEnrollment({ courseId: course.id, isEnrolled: true }),
          );
          dispatch(
            showSnackbarSuccess({ message: `Enrolled in "${course.title}"!` }),
          );
          const existing = await loadEnrolledCourses();
          if (!existing.includes(course.id)) {
            await saveEnrolledCourses([...existing, course.id]);
          }
        }
      } catch {
        // Ignore malformed messages
      }
    },
    [course, bookmarked, dispatch, sendBookmarkUpdateToWebView],
  );

  if (!course) {
    return (
      <ScreenWrapper disableScroll safeArea centerContent>
        <AppText variant="h4">Course not found</AppText>
        <TouchableOpacity onPress={() => router.back()}>
          <AppText variant="label" color={Colors.primary} style={{ marginTop: 12 }}>
            Go back
          </AppText>
        </TouchableOpacity>
      </ScreenWrapper>
    );
  }

  const html = buildCourseWebViewHTML(course);

  return (
    <ScreenWrapper disableScroll safeArea={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="arrow-back-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <AppText variant="h4" numberOfLines={1} style={styles.headerTitle}>
          {courseTitle ?? course.title}
        </AppText>
        <View style={{ width: 38 }} />
      </View>

      {/* Loading indicator over WebView */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {/* Error fallback */}
      {hasError ? (
        <View style={styles.errorState}>
          <Icon name="globe-outline" size={48} color={Colors.textMuted} />
          <AppText
            variant="h4"
            align="center"
            style={{ marginTop: 16 }}
          >
            Failed to load content
          </AppText>
          <AppText variant="bodySm" color={Colors.textSecondary} align="center">
            Check your connection and try again
          </AppText>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setHasError(false);
              setIsLoading(true);
              webViewRef.current?.reload();
            }}
          >
            <Icon name="refresh-outline" size={16} color={Colors.textInverse} />
            <AppText variant="label" color={Colors.textInverse}>
              Retry
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html, baseUrl: '' }}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            dispatch(showSnackbarError({ message: 'Failed to load course content' }));
          }}
          onMessage={handleMessage}
          // ── Security settings ────────────────────────────────────────
          javaScriptEnabled
          domStorageEnabled={false}
          allowFileAccess={false}
          originWhitelist={['*']}
          // ── Performance ──────────────────────────────────────────────
          cacheEnabled
          renderToHardwareTextureAndroid
          style={{ flex: 1 }}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: Colors.inputBackground,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
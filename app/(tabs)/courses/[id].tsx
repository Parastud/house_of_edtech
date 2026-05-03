import { AppButton } from '@/src/components/common/AppButton';
import { AppText } from '@/src/components/common/AppText';
import { ScreenWrapper } from '@/src/components/common/ScreenWrapper';
import { useBookmarks } from '@/src/hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '@/src/redux/hook';
import {
  updateCourseEnrollment,
} from '@/src/redux/slices/course.slice';
import {
  showSnackbarSuccess,
} from '@/src/redux/slices/snackbar.slice';
import { Colors } from '@/src/theme/colors';
import { FONTS, FontSize } from '@/src/theme/fonts';
import { Icon } from '@/src/theme/icons';
import { GlobalStyles } from '@/src/theme/styles.global';
import {
  loadEnrolledCourses,
  saveEnrolledCourses,
} from '@/src/utils/localStorageKey';
import { formatPrice, formatRating } from '@/src/utils/utils';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toggle, isBookmarked } = useBookmarks();

  const course = useAppSelector((s) =>
    s.courses.items.find((c : { id: string }) => c.id === id),
  );

  const bookmarked = course ? isBookmarked(course.id) : false;

  const handleEnroll = useCallback(async () => {
    if (!course || course.isEnrolled) return;

    dispatch(
      updateCourseEnrollment({ courseId: course.id, isEnrolled: true }),
    );
    dispatch(
      showSnackbarSuccess({
        message: `Enrolled in "${course.title}"!`,
      }),
    );

    // Persist enrollment
    const existing = await loadEnrolledCourses();
    if (!existing.includes(course.id)) {
      await saveEnrolledCourses([...existing, course.id]);
    }
  }, [course, dispatch]);

  const handleBookmark = useCallback(() => {
    if (!course) return;
    toggle(course.id, course.title);
  }, [course, toggle]);

  const handleOpenWebView = useCallback(() => {
    if (!course) return;
    router.push({
      pathname: '/(tabs)/courses/webview/course',
      params: { courseId: course.id, courseTitle: course.title },
    });
  }, [course, router]);

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

  return (
    <ScreenWrapper disableScroll safeArea={false}>
      <View style={{marginTop: 12}} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: course.thumbnailUrl }}
            style={styles.hero}
            contentFit="cover"
          />
          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back-outline" size={22} color={Colors.textInverse} />
          </TouchableOpacity>
          {/* Bookmark button */}
          <TouchableOpacity
            style={styles.bookmarkHeroBtn}
            onPress={handleBookmark}
          >
            <Icon
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={bookmarked ? Colors.bookmarkActive : Colors.textInverse}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Category */}
          <View className="flex-row mb-2">
            <View style={styles.categoryBadge}>
              <AppText variant="caption" style={styles.categoryText}>
                {course.category}
              </AppText>
            </View>
            {course.isEnrolled && (
              <View style={styles.enrolledChip}>
                <Icon name="checkmark-circle" size={12} color={Colors.success} />
                <AppText variant="caption" style={styles.enrolledChipText}>
                  Enrolled
                </AppText>
              </View>
            )}
          </View>

          {/* Title */}
          <AppText variant="h2" style={styles.title}>
            {course.title}
          </AppText>

          {/* Brand */}
          <AppText variant="bodySm" color={Colors.textSecondary}>
            by {course.brand}
          </AppText>

          {/* Stats */}
          <View className="flex-row items-center gap-4 mt-3 mb-4">
            <View className="flex-row items-center gap-1">
              <Icon name="star" size={16} color={Colors.accent} />
              <AppText variant="label" color={Colors.textPrimary}>
                {formatRating(course.rating)}
              </AppText>
            </View>
            <View style={styles.dividerV} />
            <AppText variant="label" color={Colors.primary}>
              {formatPrice(course.price, course.discountPercentage)}
            </AppText>
            {course.discountPercentage > 0 && (
              <>
                <AppText
                  variant="caption"
                  style={styles.originalPrice}
                >
                  ${course.price.toFixed(2)}
                </AppText>
                <View style={styles.discountBadge}>
                  <AppText variant="caption" style={styles.discountText}>
                    -{Math.round(course.discountPercentage)}%
                  </AppText>
                </View>
              </>
            )}
          </View>

          {/* Description */}
          <AppText variant="h4" style={{ marginBottom: 8 }}>
            About this course
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.description}>
            {course.description}
          </AppText>

          {/* Instructor */}
          <AppText variant="h4" style={styles.sectionTitle}>
            Instructor
          </AppText>
          <View style={[styles.instructorCard, GlobalStyles.cardShadowSm]}>
            <Image
              source={{ uri: course.instructor.avatarUrl }}
              style={styles.instructorAvatar}
              contentFit="cover"
            />
            <View style={{ flex: 1 }}>
              <AppText variant="label">{course.instructor.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                {course.instructor.location}
              </AppText>
              <AppText variant="caption" color={Colors.textMuted}>
                {course.instructor.email}
              </AppText>
            </View>
          </View>

          {/* Web content button */}
          <TouchableOpacity
            style={styles.webViewRow}
            onPress={handleOpenWebView}
            activeOpacity={0.8}
          >
            <Icon name="globe-outline" size={20} color={Colors.primary} />
            <AppText variant="label" color={Colors.primary}>
              View course content
            </AppText>
            <Icon name="arrow-forward-outline" size={18} color={Colors.primary} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky enroll button */}
      <View style={styles.footer}>
        <AppButton
          label={course.isEnrolled ? 'Already Enrolled ✅' : 'Enroll Now 🚀'}
          onPress={handleEnroll}
          disabled={course.isEnrolled}
          variant={course.isEnrolled ? 'ghost' : 'primary'}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center' },
  heroContainer: { position: 'relative', height: 260 },
  hero: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    padding: 8,
  },
  bookmarkHeroBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    padding: 8,
  },
  content: { padding: 20, paddingBottom: 8 },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginRight: 8,
  },
  categoryText: {
    color: Colors.primary,
    fontFamily: FONTS.SEMIBOLD,
    textTransform: 'capitalize',
  },
  enrolledChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  enrolledChipText: { color: Colors.success, fontFamily: FONTS.SEMIBOLD },
  title: { marginTop: 8, marginBottom: 4 },
  dividerV: { width: 1, height: 16, backgroundColor: Colors.border },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  discountBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  discountText: { color: Colors.success, fontFamily: FONTS.SEMIBOLD },
  description: { lineHeight: FontSize.base * 1.7, marginBottom: 4 },
  sectionTitle: { marginTop: 20, marginBottom: 10 },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  instructorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.skeleton,
  },
  webViewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    backgroundColor: Colors.primaryFaded,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primaryMid,
  },
  footer: {
    padding: 20,
    paddingBottom: 28,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
import { SKELETON_COUNT } from '@/src/constants/app.constants';
import { useAppDispatch, useAppSelector } from '@/src/redux/hook';
import { LegendList } from '@legendapp/list';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import CourseCard from '../../components/course/CourseCard';
import { SearchBar } from '../../components/course/SearchBar';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useCourseApi } from '../../hooks/useCourseApi';
import { setSearch } from '../../redux/slices/course.slice';
import { Colors } from '../../theme/colors';
import { Icon } from '../../theme/icons';
import { Course } from '../../types';

export const CourseListScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { fetchCourses, refreshCourses, fetchMoreCourses } = useCourseApi();
  const { toggle } = useBookmarks();

  const {
    items,
    isLoading,
    isRefreshing,
    isFetchingMore,
    error,
    filters,
  } = useAppSelector((s) => s.courses);

  // ── Initial load ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCourses();
  }, []);

  // ── Filtered list (client-side search) ─────────────────────────────────
  const filteredCourses = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (c : { title: string; description: string; category: string; instructor: { name: string } }) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor.name.toLowerCase().includes(q),
    );
  }, [items, filters.search]);

  // ── Handlers (stable refs via useCallback) ──────────────────────────────
  const handlePress = useCallback(
    (course: Course) => {
      router.push({
        pathname: '/courses/[id]',
        params: { id: course.id },
      });
    },
    [router],
  );

  const handleBookmark = useCallback(
    (course: Course) => {
      toggle(course.id, course.title);
    },
    [toggle],
  );

  const handleSearch = useCallback(
    (text: string) => {
      dispatch(setSearch(text));
    },
    [dispatch],
  );

  const handleEndReached = useCallback(() => {
    if (!filters.search) fetchMoreCourses();
  }, [fetchMoreCourses, filters.search]);

  // ── Render item (memoized via CourseCard.memo) ──────────────────────────
  const renderItem = useCallback(
    ({ item }: { item: Course }) => (
      <CourseCard
        course={item}
        onPress={handlePress}
        onBookmarkPress={handleBookmark}
      />
    ),
    [handlePress, handleBookmark],
  );

  const keyExtractor = useCallback((item: Course) => item.id, []);

  // ── Loading skeletons ───────────────────────────────────────────────────
  if (isLoading && items.length === 0) {
    return (
      <ScreenWrapper disableScroll safeArea>
        <View style={styles.header}>
          <AppText variant="h2">Courses</AppText>
        </View>
        <SearchBar
          value=""
          onChangeText={() => {}}
          placeholder="Search courses..."
        />
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </ScreenWrapper>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (error && items.length === 0) {
    return (
      <ScreenWrapper
        disableScroll
        safeArea
        centerContent
        contentContainerStyle={styles.centered}
      >
        <Icon name="alert-circle-outline" size={48} color={Colors.error} />
        <AppText variant="h4" align="center" style={{ marginTop: 12 }}>
          Failed to load courses
        </AppText>
        <AppText
          variant="bodySm"
          color={Colors.textSecondary}
          align="center"
          style={{ marginTop: 4 }}
        >
          {error}
        </AppText>
        <View className="mt-4">
          <AppText
            variant="label"
            color={Colors.primary}
            onPress={fetchCourses}
          >
            Tap to retry
          </AppText>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper disableScroll safeArea>
      <LegendList
        data={filteredCourses}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={320}
        recycleItems
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <AppText variant="h2">Explore Courses</AppText>
              <AppText variant="bodySm" color={Colors.textSecondary}>
                {filteredCourses.length} courses
              </AppText>
            </View>
            <SearchBar
              value={filters.search}
              onChangeText={handleSearch}
              placeholder="Search by title, category..."
            />
          </View>
        }
        // ── Pull-to-refresh ──────────────────────────────────────────────
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshCourses}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        // ── Pagination ───────────────────────────────────────────────────
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        // ── Footer: spinner while loading more ───────────────────────────
        ListFooterComponent={
          isFetchingMore ? (
            <LoadingOverlay message="Loading more..." />
          ) : null
        }
        // ── Empty state ──────────────────────────────────────────────────
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="search-outline" size={48} color={Colors.textMuted} />
            <AppText
              variant="h4"
              align="center"
              color={Colors.textSecondary}
              style={{ marginTop: 12 }}
            >
              No courses found
            </AppText>
            <AppText
              variant="bodySm"
              align="center"
              color={Colors.textMuted}
            >
              Try a different search term
            </AppText>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 32,
    gap: 6,
  },
});
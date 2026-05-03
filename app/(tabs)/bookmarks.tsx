import { useAppSelector } from '@/src/redux/hook';
import { LegendList } from '@legendapp/list';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../src/components/common/AppText';
import CourseCard from '../../src/components/course/CourseCard';
import { useBookmarks } from '../../src/hooks/useBookmarks';
import { Colors } from '../../src/theme/colors';
import { Icon } from '../../src/theme/icons';
import { GlobalStyles } from '../../src/theme/styles.global';
import { Course } from '../../src/types';

export default function BookmarksScreen() {
  const router = useRouter();
  const { toggle } = useBookmarks();
  const bookmarkIds = useAppSelector((s) => s.bookmarks.ids);
  const allCourses = useAppSelector((s) => s.courses.items);

  const bookmarkedCourses = useMemo(
    () => allCourses.filter((c : { id: string }) => bookmarkIds.includes(c.id)),
    [allCourses, bookmarkIds],
  );

  const handlePress = useCallback(
    (course: Course) => {
      router.push({ pathname: '/courses/[id]', params: { id: course.id } });
    },
    [router],
  );

  const handleBookmark = useCallback(
    (course: Course) => toggle(course.id, course.title),
    [toggle],
  );

  const keyExtractor = useCallback((item: Course) => item.id, []);

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

  return (
    <SafeAreaView style={GlobalStyles.screen}>
      <LegendList
        data={bookmarkedCourses}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={320}
        recycleItems
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="h2">Saved Courses</AppText>
            <AppText variant="bodySm" color={Colors.textSecondary}>
              {bookmarkedCourses.length} saved
            </AppText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="bookmark-outline" size={56} color={Colors.textMuted} />
            <AppText variant="h4" align="center" style={{ marginTop: 16 }}>
              No saved courses yet
            </AppText>
            <AppText
              variant="bodySm"
              color={Colors.textSecondary}
              align="center"
            >
              Tap the bookmark icon on any course to save it here
            </AppText>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 8,
  },
  listContent: { paddingBottom: 32 },
});
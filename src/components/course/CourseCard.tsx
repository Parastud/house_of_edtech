import { Images } from '@/src/theme/images';
import { Image } from 'expo-image';
import React, { memo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../theme/colors';
import { FONTS, FontSize } from '../../theme/fonts';
import { Icon } from '../../theme/icons';
import { GlobalStyles } from '../../theme/styles.global';
import { Course } from '../../types';
import { formatPrice, formatRating } from '../../utils/utils';
import { AppText } from '../common/AppText';

interface CourseCardProps {
  course: Course;
  onPress: (course: Course) => void;
  onBookmarkPress: (course: Course) => void;
}

// ─── Memoized — only re-renders when course data or handlers change ───────────
const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPress,
  onBookmarkPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => onPress(course)}
      style={[styles.card, GlobalStyles.cardShadow]}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: course.thumbnailUrl }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={300}
          placeholder={Images.coursePlaceholder}
        />
        {/* Category badge overlaid on image */}
        <View style={styles.categoryBadge}>
          <AppText variant="caption" style={styles.categoryText}>
            {course.category}
          </AppText>
        </View>

        {/* Bookmark button overlaid on image */}
        <TouchableOpacity
          style={styles.bookmarkBtn}
          onPress={() => onBookmarkPress(course)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.8}
        >
          <Icon
            name={course.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={
              course.isBookmarked
                ? Colors.bookmarkActive
                : Colors.textInverse
            }
          />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Title */}
        <AppText variant="h4" numberOfLines={2} style={styles.title}>
          {course.title}
        </AppText>

        {/* Description */}
        <AppText variant="bodySm" numberOfLines={2} style={styles.description}>
          {course.description}
        </AppText>

        {/* Instructor row */}
        <View style={styles.instructorRow}>
          <Image
            source={{ uri: course.instructor.avatarUrl }}
            style={styles.instructorAvatar}
            contentFit="cover"
          />
          <AppText variant="labelSm" numberOfLines={1} style={styles.instructorName}>
            {course.instructor.name}
          </AppText>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {/* Rating */}
          <View style={styles.stat}>
            <Icon name="star" size={14} color={Colors.accent} />
            <AppText variant="caption" style={styles.statText}>
              {formatRating(course.rating)}
            </AppText>
          </View>

          {/* Price */}
          <View style={styles.stat}>
            <AppText
              variant="label"
              style={styles.price}
            >
              {formatPrice(course.price, course.discountPercentage)}
            </AppText>
            {course.discountPercentage > 0 && (
              <AppText variant="caption" style={styles.originalPrice}>
                ${course.price.toFixed(2)}
              </AppText>
            )}
          </View>

          {/* Enrolled badge */}
          {course.isEnrolled && (
            <View style={styles.enrolledBadge}>
              <Icon name="checkmark-circle-outline" size={12} color={Colors.success} />
              <AppText variant="caption" style={styles.enrolledText}>
                Enrolled
              </AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(CourseCard, (prev, next) => {
  // Custom comparator — only re-render if these specific fields change
  return (
    prev.course.id === next.course.id &&
    prev.course.isBookmarked === next.course.isBookmarked &&
    prev.course.isEnrolled === next.course.isEnrolled &&
    prev.onPress === next.onPress &&
    prev.onBookmarkPress === next.onBookmarkPress
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    height: 180,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    color: Colors.textInverse,
    fontFamily: FONTS.SEMIBOLD,
    textTransform: 'capitalize',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 6,
  },
  body: {
    padding: 14,
    gap: 8,
  },
  title: {
    lineHeight: FontSize.lg * 1.35,
  },
  description: {
    color: Colors.textSecondary,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructorAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.skeleton,
  },
  instructorName: {
    flex: 1,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: Colors.textSecondary,
    fontFamily: FONTS.MEDIUM,
  },
  price: {
    color: Colors.primary,
    fontFamily: FONTS.BOLD,
    fontSize: FontSize.base,
  },
  originalPrice: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  enrolledText: {
    color: Colors.success,
    fontFamily: FONTS.SEMIBOLD,
  },
});
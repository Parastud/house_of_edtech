import { useAppSelector } from '@/src/redux/hook';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../src/components/common/AppText';
import { ScreenWrapper } from '../../src/components/common/ScreenWrapper';
import { Colors } from '../../src/theme/colors';
import { Icon } from '../../src/theme/icons';

const QuickStatCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  bgColor: string;
  onPress: () => void;
}> = ({ icon, value, label, color, bgColor, onPress }) => (
  <TouchableOpacity
    style={[styles.quickStat, { borderColor: color + '30' }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.quickStatIcon, { backgroundColor: bgColor }]}>
      {icon}
    </View>
    <AppText variant="h3" color={color}>
      {value}
    </AppText>
    <AppText variant="caption" color={Colors.textSecondary}>
      {label}
    </AppText>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();
  const user = useAppSelector((s) => s.user);
  const bookmarkCount = useAppSelector((s : { bookmarks: { ids: string[] } }) => s.bookmarks.ids.length);
  const courses = useAppSelector((s) => s.courses.items);
  const enrolledCount = courses.filter((c : { isEnrolled: boolean }) => c.isEnrolled).length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScreenWrapper
      disableScroll
      safeArea
      statusBarColor={Colors.surface}
      style={styles.wrapper}
      contentContainerStyle={styles.wrapperContent}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View>
            <AppText variant="bodySm" color={Colors.textSecondary}>
              {greeting()} 👋
            </AppText>
            <AppText variant="h2">
              {user.username || 'Learner'}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.notifBtn}
          >
            <Icon
              name="notifications-outline"
              size={22}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Hero banner */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <AppText variant="h3" color={Colors.textInverse}>
              Ready to learn something new?
            </AppText>
            <AppText
              variant="bodySm"
              color="rgba(255,255,255,0.8)"
              style={{ marginTop: 4, marginBottom: 16 }}
            >
              Explore hundreds of courses across every category.
            </AppText>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => router.push('/(tabs)/courses')}
            >
              <AppText variant="label" color={Colors.primary}>
                Browse Courses
              </AppText>
              <Icon name="arrow-forward-outline" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.bannerEmoji}>
            <AppText style={{ fontSize: 64 }}>🎓</AppText>
          </View>
        </View>

        {/* Quick stats */}
        <AppText variant="h4" style={styles.sectionTitle}>
          Your Progress
        </AppText>
        <View style={styles.quickStats}>
          <QuickStatCard
            icon={<Icon name="book-outline" size={20} color={Colors.primary} />}
            value={enrolledCount}
            label="Enrolled"
            color={Colors.primary}
            bgColor={Colors.primaryLight}
            onPress={() => router.push('/(tabs)/courses')}
          />
          <QuickStatCard
            icon={
              <Icon name="bookmark-outline" size={20} color={Colors.accent} />
            }
            value={bookmarkCount}
            label="Saved"
            color={Colors.accent}
            bgColor={Colors.accentLight}
            onPress={() => router.push('/(tabs)/bookmarks')}
          />
        </View>

        {/* CTA */}
        {bookmarkCount === 0 && (
          <View style={styles.cta}>
            <Icon name="information-circle-outline" size={20} color={Colors.primary} />
            <AppText variant="bodySm" color={Colors.primary} style={{ flex: 1 }}>
              Bookmark 5 courses and earn a special achievement!
            </AppText>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background,
  },
  wrapperContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  scroll: { padding: 20, paddingBottom: 40 },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerEmoji: { paddingLeft: 8 },
  sectionTitle: { marginBottom: 14 },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickStat: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  quickStatIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.primaryFaded,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primaryMid,
  },
});
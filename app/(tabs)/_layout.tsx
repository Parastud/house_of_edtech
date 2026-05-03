import { useAppSelector } from '@/src/redux/hook';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../src/components/common/AppText';
import { Colors } from '../../src/theme/colors';
import { FONTS, FontSize } from '../../src/theme/fonts';
import { Icon, ICON_NAMES } from '../../src/theme/icons';

interface TabIconProps {
  focused: boolean;
  name: React.ComponentProps<typeof Icon>['name'];
  focusedName: React.ComponentProps<typeof Icon>['name'];
  label: string;
  badgeCount?: number;
}

const TAB_META: Record<string, Omit<TabIconProps, 'focused' | 'badgeCount'>> = {
  index: {
    name: ICON_NAMES.home,
    focusedName: ICON_NAMES.homeFilled,
    label: 'Home',
  },
  courses: {
    name: ICON_NAMES.courses,
    focusedName: ICON_NAMES.coursesFilled,
    label: 'Courses',
  },
  bookmarks: {
    name: ICON_NAMES.bookmarks,
    focusedName: ICON_NAMES.bookmarksFilled,
    label: 'Saved',
  },
  profile: {
    name: ICON_NAMES.profile,
    focusedName: ICON_NAMES.profileFilled,
    label: 'Profile',
  },
};

const TabIcon: React.FC<TabIconProps> = ({
  focused,
  name,
  focusedName,
  label,
  badgeCount,
}) => (
  <View style={styles.tabItem}>
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      {focused && <View style={styles.activeDot} />}
      <Icon
        name={focused ? focusedName : name}
        size={22}
        color={focused ? Colors.primary : Colors.textMuted}
      />
      {!!badgeCount && (
        <View style={styles.badge}>
          <AppText variant="caption" style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </AppText>
        </View>
      )}
    </View>
    <AppText
      variant="caption"
      style={[
        styles.tabLabel,
        { color: focused ? Colors.primary : Colors.textMuted },
        focused && styles.tabLabelActive,
      ]}
    >
      {label}
    </AppText>
  </View>
);

const CustomTabBar: React.FC<BottomTabBarProps & { bookmarkCount: number }> = ({
  state,
  descriptors,
  navigation,
  bookmarkCount,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarShell, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.tabBarRow}>
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name] ?? {
            name: ICON_NAMES.more,
            focusedName: ICON_NAMES.more,
            label: route.name,
          };

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const options = descriptors[route.key]?.options;
          const accessibilityLabel = options?.tabBarAccessibilityLabel;

          return (
            <Pressable
              key={route.key}
              style={styles.tabPressable}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityLabel={accessibilityLabel}
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <TabIcon
                focused={isFocused}
                name={meta.name}
                focusedName={meta.focusedName}
                label={meta.label}
                badgeCount={route.name === 'bookmarks' ? bookmarkCount : undefined}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default function TabsLayout() {
  const bookmarkCount = useAppSelector((s) => s.bookmarks.ids.length);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} bookmarkCount={bookmarkCount} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="courses" />
      <Tabs.Screen name="bookmarks" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarShell: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
    paddingHorizontal: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 12,
  },
  tabBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  tabPressable: {
    flex: 1,
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  iconWrap: {
    position: 'relative',
    width: 42,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryFaded,
  },
  activeDot: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 3,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -7,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: Colors.surface,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontFamily: FONTS.BOLD,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontFamily: FONTS.MEDIUM,
  },
  tabLabelActive: {
    fontFamily: FONTS.SEMIBOLD,
  },
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 72,
    paddingBottom: 12,
    paddingTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  // kept for reference if you want to quickly rollback to stock tab style
});
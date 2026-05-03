import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  statusBarColor?: string;
  headerComponent?: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  barStyle?: StatusBarStyle;
  hideStatusBar?: boolean;
  centerContent?: boolean;
  safeArea?: boolean;
  scrollProps?: KeyboardAwareScrollViewProps;
  disableScroll?: boolean;
  onRefresh?: () => Promise<void>;
}

export function ScreenWrapper({
  children,
  statusBarColor = Colors.surface,
  headerComponent,
  style,
  contentContainerStyle,
  barStyle = 'dark-content',
  hideStatusBar = false,
  centerContent = false,
  safeArea = true,
  scrollProps,
  disableScroll,
  onRefresh,
}: ScreenWrapperProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const combinedContentStyle = [
    styles.contentContainer,
    centerContent && styles.centerContent,
    contentContainerStyle,
  ];

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const content = disableScroll ? (
    <View style={[combinedContentStyle, { flex: 1 }]}>{children}</View>
  ) : (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={combinedContentStyle}
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        ) : undefined
      }
      {...scrollProps}
    >
      {children}
    </KeyboardAwareScrollView>
  );

  return (
    <View style={[styles.mainContainer, { backgroundColor: statusBarColor }, style]}>
      {!hideStatusBar && (
        <StatusBar
          translucent={false}
          backgroundColor={statusBarColor}
          barStyle={barStyle}
        />
      )}

      <View
        style={[
          styles.flex,
          { paddingTop: headerComponent || safeArea ? safeAreaInsets.top : 0 },
        ]}
      >
        {headerComponent}
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    zIndex: 1,
  },
  flex: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  centerContent: {
    justifyContent: 'center',
    flex: 1,
  },
});

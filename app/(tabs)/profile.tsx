import { AppButton } from '@/src/components/common/AppButton';
import { AppText } from '@/src/components/common/AppText';
import { ScreenWrapper } from '@/src/components/common/ScreenWrapper';
import { useAuthApi } from '@/src/hooks/useAuthApi';
import { useAppDispatch, useAppSelector } from '@/src/redux/hook';
import { clearBookmarks } from '@/src/redux/slices/bookmark.slice';
import { clearCourses } from '@/src/redux/slices/course.slice';
import { clearUser } from '@/src/redux/slices/user.slice';
import { Images } from '@/src/theme';
import { Colors } from '@/src/theme/colors';
import { FONTS, FontSize } from '@/src/theme/fonts';
import { Icon } from '@/src/theme/icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface StatCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
    <View style={styles.statCard}>
        {icon}
        <AppText variant="h3" align="center">
            {value}
        </AppText>
        <AppText variant="caption" align="center" color={Colors.textSecondary}>
            {label}
        </AppText>
    </View>
);

export default function ProfileScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { logout, updateAvatar, isLoading } = useAuthApi();
    const user = useAppSelector((s) => s.user);
    const bookmarkCount = useAppSelector((s) => s.bookmarks.ids.length);
    const enrolledCount = useAppSelector(
        (s) => s.courses.items.filter((c : { isEnrolled: boolean }) => c.isEnrolled).length,
    );

    const handlePickAvatar = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission needed',
                'Please allow access to your photo library.',
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            const mimeType = asset.mimeType ?? 'image/jpeg';
            await updateAvatar(asset.uri, mimeType);
        }
    }, [updateAvatar]);

    const handleLogout = useCallback(() => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    dispatch(clearUser());
                    dispatch(clearBookmarks());
                    dispatch(clearCourses());
                    const success = await logout();
                    if (success) {
                        router.replace('/(auth)/login');
                    }
                },
            },
        ]);
    }, [logout, dispatch]);

    return (
        <ScreenWrapper disableScroll safeArea>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {/* Header */}
                <View style={styles.headerBg}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                user.avatarUrl
                                    ? { uri: user.avatarUrl }
                                    : Images.avatarPlaceholder
                            }
                            style={styles.avatar}
                            contentFit="cover"
                        />
                        <TouchableOpacity
                            style={styles.cameraBtn}
                            onPress={handlePickAvatar}
                        >
                            <Icon name="camera-outline" size={16} color={Colors.textInverse} />
                        </TouchableOpacity>
                    </View>
                    <AppText variant="h3" align="center" color={Colors.textInverse}>
                        {user.username || 'User'}
                    </AppText>
                    <AppText
                        variant="bodySm"
                        align="center"
                        color="rgba(255,255,255,0.75)"
                    >
                        {user.email}
                    </AppText>
                    {user.isEmailVerified && (
                        <View style={styles.verifiedBadge}>
                            <Icon name="checkmark-circle" size={14} color={Colors.success} />
                            <AppText variant="caption" color={Colors.success}>
                                Verified
                            </AppText>
                        </View>
                    )}
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <StatCard
                        icon={<Icon name="book-outline" size={24} color={Colors.primary} />}
                        value={enrolledCount}
                        label="Enrolled"
                    />
                    <View style={styles.statDivider} />
                    <StatCard
                        icon={
                            <Icon name="bookmark-outline" size={24} color={Colors.accent} />
                        }
                        value={bookmarkCount}
                        label="Bookmarked"
                    />
                </View>

                {/* Info rows */}
                <View style={styles.section}>
                    <AppText variant="h4" style={styles.sectionTitle}>
                        Account
                    </AppText>

                    <View style={styles.infoRow}>
                        <Icon name="person-outline" size={20} color={Colors.textSecondary} />
                        <View style={styles.infoContent}>
                            <AppText variant="labelSm">Username</AppText>
                            <AppText variant="bodySm">{user.username || '—'}</AppText>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Icon name="mail-outline" size={20} color={Colors.textSecondary} />
                        <View style={styles.infoContent}>
                            <AppText variant="labelSm">Email</AppText>
                            <AppText variant="bodySm">{user.email || '—'}</AppText>
                        </View>
                    </View>
                </View>

                {/* Logout */}
                <View style={styles.section}>
                    <AppButton
                        label="Sign Out"
                        onPress={handleLogout}
                        variant="outline"
                        isLoading={isLoading}
                        leftIcon={
                            <Icon name="log-out-outline" size={18} color={Colors.primary} />
                        }
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    scroll: { paddingBottom: 40 },
    headerBg: {
        backgroundColor: Colors.primary,
        paddingTop: 32,
        paddingBottom: 28,
        alignItems: 'center',
        gap: 6,
    },
    avatarContainer: { position: 'relative', marginBottom: 8 },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: Colors.surface,
        backgroundColor: Colors.skeleton,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.accent,
        borderRadius: 16,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.surface,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        marginHorizontal: 20,
        marginTop: -16,
        borderRadius: 16,
        paddingVertical: 20,
        // shadow
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.divider,
        marginVertical: 8,
    },
    section: {
        marginHorizontal: 20,
        marginTop: 24,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
    },
    sectionTitle: {
        marginBottom: 14,
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
        fontFamily: FONTS.SEMIBOLD,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 4,
    },
    infoContent: { gap: 2 },
    divider: {
        height: 1,
        backgroundColor: Colors.divider,
        marginVertical: 12,
        marginLeft: 32,
    },
});
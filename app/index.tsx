import { CustomSplash } from '@/src/components/common/CustomSplash';
import { useBookmarks } from '@/src/hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '@/src/redux/hook';
import { setAuthorizationStatus, setBootstrapping } from '@/src/redux/slices/auth.slice';
import { setUser } from '@/src/redux/slices/user.slice';
import { getCurrentUserService } from '@/src/services';
import { getAccessToken } from '@/src/utils/localStorageKey';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

export default function Index() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { hydrateFromStorage } = useBookmarks();
  const { isAuthorized, isBootstrapping } = useAppSelector((s) => s.auth);

  const [isSplashVisible, setSplashVisible] = useState(true);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          const userData = await getCurrentUserService();
          if (userData.success) {
            const user = userData.data.data;
            dispatch(
              setUser({
                id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatar?.url ?? '',
                isEmailVerified: user.isEmailVerified,
              }),
            );
            dispatch(setAuthorizationStatus(true));
          } else {
            dispatch(setAuthorizationStatus(false));
          }
        } else {
          dispatch(setAuthorizationStatus(false));
        }
      } catch {
        dispatch(setAuthorizationStatus(false));
      } finally {
        dispatch(setBootstrapping(false));
        await hydrateFromStorage();
      }
    };

    initializeAuth();

    const splashTimeout = setTimeout(() => {
      setSplashVisible(false);
    }, 2000);

    return () => clearTimeout(splashTimeout);
  }, [dispatch, hydrateFromStorage]);

  useEffect(() => {
    if (isSplashVisible || isBootstrapping || hasRedirected.current) return;

    hasRedirected.current = true;

    if (isAuthorized) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isAuthorized, isSplashVisible, isBootstrapping, router]);

  return <CustomSplash onFinish={() => {}} />;
}
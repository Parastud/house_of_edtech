import {
  showSnackbarError,
  showSnackbarSuccess,
} from '@/src/redux/slices/snackbar.slice';
import { setUser } from '@/src/redux/slices/user.slice';
import {
  changeAvatarService,
  getCurrentUserService,
  loginService,
  logoutService,
  registerService,
} from '@/src/services';
import { getErrorMessage } from '@/src/utils/utils';
import { useState } from 'react';
import { useAppDispatch } from '../redux/hook';
import { setAuthorizationStatus } from '../redux/slices/auth.slice';
import { LoginPayload, RegisterPayload } from '../types';
import {
  clearAppData,
  clearAuthTokens,
  saveAccessToken,
  saveRefreshToken,
} from '../utils/localStorageKey';

interface UseAuthApiReturn {
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<boolean>;
  fetchCurrentUser: () => Promise<boolean>;
  updateAvatar: (uri: string, mimeType: string) => Promise<boolean>;
}

export const useAuthApi = (): UseAuthApiReturn => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (payload: LoginPayload): Promise<boolean> => {
    try {
      setIsLoading(true);
      const data = await loginService(payload);

      if (data.success) {
        const { accessToken, refreshToken, user } = data.data;
        await saveAccessToken(accessToken);
        await saveRefreshToken(refreshToken);

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
        dispatch(showSnackbarSuccess({ message: 'Welcome back!' }));
        return true;
      }
      return false;
    } catch (error) {
      dispatch(showSnackbarError({ message: getErrorMessage(error) }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    try {
      setIsLoading(true);
      const data = await registerService(payload);

      // Safe logging: avoid passing complex/native objects directly to console
      try {
        const serialized = JSON.stringify(data);
      } catch (e) {
      }

      if (data.success) {
        const { user } = data.data;

        if(user){
          dispatch(showSnackbarSuccess({ message: 'Account created successfully!' }));
          return true;
        }

        // Backend didn't return tokens (e.g. requires email verification first)
        dispatch(showSnackbarSuccess({ message: data.message || 'Registration successful. Please verify your email.' }));
        return true;
      }
      return false;
    } catch (error) {
      dispatch(showSnackbarError({ message: getErrorMessage(error) }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      await logoutService().catch(() => { }); // best-effort server logout
      await clearAuthTokens();
      await clearAppData();
      dispatch(setAuthorizationStatus(false));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async (): Promise<boolean> => {
    try {
      const data = await getCurrentUserService();
      if (data.success) {
        const { user } = data.data;
        dispatch(
          setUser({
            id: user._id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatar?.url ?? '',
            isEmailVerified: user.isEmailVerified,
          }),
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateAvatar = async (
    uri: string,
    mimeType: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('avatar', {
        uri,
        type: mimeType,
        name: 'avatar.jpg',
      } as unknown as Blob);

      const data = await changeAvatarService(formData);
      if (data.success) {
        const newUrl = data.data.avatar?.url ?? '';
        dispatch(setUser({ avatarUrl: newUrl }));
        dispatch(showSnackbarSuccess({ message: 'Profile picture updated!' }));
        return true;
      }
      return false;
    } catch (error) {
      dispatch(showSnackbarError({ message: getErrorMessage(error) }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, login, register, logout, fetchCurrentUser, updateAvatar };
};
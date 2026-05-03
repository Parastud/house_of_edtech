import { API_ENDPOINTS } from '@/src/constants/api.constants';
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@/src/types';
import api from './api';

export const loginService = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    API_ENDPOINTS.LOGIN,
    payload,
  );
  return response.data;
};

export const registerService = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    API_ENDPOINTS.REGISTER,
    payload,
  );
  return response.data;
};

export const logoutService = async (): Promise<void> => {
  await api.post(API_ENDPOINTS.LOGOUT);
};

export const getCurrentUserService = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>(API_ENDPOINTS.CURRENT_USER);
  return response.data;
};

export const changeAvatarService = async (
  formData: FormData,
): Promise<AuthResponse> => {
  const response = await api.patch<AuthResponse>(
    API_ENDPOINTS.CHANGE_AVATAR,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data;
};
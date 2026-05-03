export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  statusCode: number;
  data: {
    data: any;
    _id: string | null | undefined;
    username: string | undefined;
    email: string | undefined;
    avatar: any;
    isEmailVerified: boolean | undefined;
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar: {
    url: string;
    localPath: string;
  };
  role: string;
  loginType: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshTokenResponse {
  statusCode: number;
  data: AuthTokens;
  message: string;
  success: boolean;
}
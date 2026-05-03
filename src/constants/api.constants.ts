// ─── API Endpoints ────────────────────────────────────────────────────────────
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/v1/users/register',
  LOGIN: '/api/v1/users/login',
  LOGOUT: '/api/v1/users/logout',
  REFRESH_TOKEN: '/api/v1/users/refresh-token',
  CURRENT_USER: '/api/v1/users/current-user',
  CHANGE_AVATAR: '/api/v1/users/avatar',

  // Public
  RANDOM_USERS: '/api/v1/public/randomusers',
  RANDOM_PRODUCTS: '/api/v1/public/randomproducts',
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
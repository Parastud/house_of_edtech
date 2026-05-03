import { API_ENDPOINTS } from '@/src/constants/api.constants';
import {
    API_RETRY_COUNT,
    API_RETRY_DELAY_BASE_MS,
    API_TIMEOUT_MS,
} from '@/src/constants/app.constants';
import { RefreshTokenResponse } from '@/src/types';
import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from 'axios';
import { BASEURL } from '../../app.env';
import {
    clearAuthTokens,
    getAccessToken,
    getRefreshToken,
    saveAccessToken,
    saveRefreshToken,
} from '../utils/localStorageKey';

// ─── Augment config to track retry state ─────────────────────────────────────
interface RetryConfig extends InternalAxiosRequestConfig {
    _retryCount?: number;
    _isRetry?: boolean;
}

// ─── Create instance ──────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
    baseURL: BASEURL,
    timeout: API_TIMEOUT_MS,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — attach access token ────────────────────────────────
api.interceptors.request.use(
    async (config: RetryConfig) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ─── Track in-flight token refresh to avoid parallel refresh races ────────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token!);
    });
    failedQueue = [];
};

// ─── Response interceptor — handle 401 refresh + retry logic ─────────────────
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const config = error.config as RetryConfig;

        if (!config) return Promise.reject(error);

        // ── 401: attempt token refresh once ──────────────────────────────────
        if (error.response?.status === 401 && !config._isRetry) {
            if (isRefreshing) {
                // Queue this request until refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            config.headers.Authorization = `Bearer ${token}`;
                            resolve(api(config));
                        },
                        reject,
                    });
                });
            }

            config._isRetry = true;
            isRefreshing = true;

            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) throw new Error('No refresh token');

                const response = await axios.post<RefreshTokenResponse>(
                    `${BASEURL}${API_ENDPOINTS.REFRESH_TOKEN}`,
                    { refreshToken },
                );

                const { accessToken, refreshToken: newRefresh } =
                    response.data.data;

                await saveAccessToken(accessToken);
                await saveRefreshToken(newRefresh);

                api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                processQueue(null, accessToken);

                return api(config);
            } catch (refreshError) {
                processQueue(refreshError, null);
                await clearAuthTokens();
                // Let Redux handle logout via the 401 being propagated
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // ── Retry on network errors / 5xx (not on 4xx client errors) ─────────
        const retryCount = config._retryCount ?? 0;
        const isNetworkError = !error.response;
        const isServerError = (error.response?.status ?? 0) >= 500;

        if ((isNetworkError || isServerError) && retryCount < API_RETRY_COUNT) {
            config._retryCount = retryCount + 1;

            // Exponential backoff: 500ms, 1000ms, 2000ms
            const delay = API_RETRY_DELAY_BASE_MS * Math.pow(2, retryCount);
            await new Promise((res) => setTimeout(res, delay));

            return api(config);
        }

        return Promise.reject(error);
    },
);

export default api;
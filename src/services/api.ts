import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('logistics_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // SKIP refresh logic for login/register/refresh routes
        const url = originalRequest.url || '';
        const isAuthRoute = url.includes('/auth/login') || 
                            url.includes('/auth/register') ||
                            url.includes('/auth/refresh');

        // If error is 401 Unauthorized and we haven't retried yet and it's NOT an auth route
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('logistics_refresh_token');
                if (!refreshToken) {
                    // Just clear everything and let the user log in again - don't throw an obscure error
                    localStorage.removeItem('logistics_token');
                    localStorage.removeItem('logistics_refresh_token');
                    localStorage.removeItem('logistics_user');
                    window.dispatchEvent(new Event('session-expired'));
                    return Promise.reject(error);
                }

                // Attempt to refresh the token
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refresh: refreshToken
                });

                const { token } = response.data;
                
                if (!token) throw new Error('Refresh failed - No token returned');

                // Save new token
                localStorage.setItem('logistics_token', token);
                
                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear auth state
                localStorage.removeItem('logistics_token');
                localStorage.removeItem('logistics_refresh_token');
                localStorage.removeItem('logistics_user');
                
                // Dispatch a custom event to notify components (like AuthContext) that session expired
                window.dispatchEvent(new Event('session-expired'));
                
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

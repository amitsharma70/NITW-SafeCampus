// src/api/axiosInstance.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
let isRefreshing = false;
let refreshSubscribers = [];

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // important for cookies (refresh token)
});

// Utility to queue requests while refresh is in progress
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((cb) => cb(newAccessToken));
  refreshSubscribers = [];
};

// REQUEST INTERCEPTOR: Attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle expired access token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for the refresh to finish, then retry
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        console.log('🔁 Attempting to refresh access token...');
        const res = await axios.post(`${baseURL}/api/users/refresh-token`, {}, { withCredentials: true });
        const newAccessToken = res.data.token;

        console.log('✅ Token refreshed successfully');
        localStorage.setItem('authToken', newAccessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        onRefreshed(newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('❌ Refresh token failed:', refreshError?.response?.data || refreshError.message);
        localStorage.removeItem('authToken');
        alert('session expired login again')
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };



import axios from "axios";

const baseUrl = "https://api.connectfour.oluwatobii.xyz/api/v1";

export const apiInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ---------------------------------------------------------------------------
// Storage keys (shared with AuthProvider)
// ---------------------------------------------------------------------------

export const STORAGE_KEYS = {
  user: "user",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  pendingEmail: "pendingVerificationEmail",
} as const;

// ---------------------------------------------------------------------------
// Request interceptor — attach access token to every request
// ---------------------------------------------------------------------------

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — silent token refresh on 401
// ---------------------------------------------------------------------------

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token);
    else p.reject(error);
  });
  failedQueue = [];
};

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only act on 401s, skip the refresh endpoint and already-retried requests
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
      if (!refreshToken) throw new Error("No refresh token");

      const { data: res } = await apiInstance.post("/auth/refresh", {
        refreshToken,
      });

      const newAccessToken: string = res.data.accessToken;
      localStorage.setItem(STORAGE_KEYS.accessToken, newAccessToken);

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Refresh token is dead — wipe storage and bounce the user out
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      window.location.href = "/";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

import axios from "axios";

export const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token antes de cada requisição
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken && isValidJwt(accessToken)) {
    const trimmedToken = accessToken.trim();
    config.headers.Authorization = `Bearer ${trimmedToken}`;
  }
  return config;
});

// Função aprimorada para validar se o token é um JWT básico
function isValidJwt(token) {
  if (!token || typeof token !== "string") return false;

  try {
    const parts = token.split(".");

    if (parts.length !== 3) return false;

    return parts.every((part) => {
      const paddedPart = part.padEnd(Math.ceil(part.length / 4) * 4, "=");
      try {
        atob(paddedPart.replace(/-/g, "+").replace(/_/g, "/"));
        return true;
      } catch (e) {
        return false;
      }
    });
  } catch (e) {
    return false;
  }
}

// Variável para controlar se já há uma renovação de token em andamento
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Interceptor para tratamento de erros de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken && isValidJwt(refreshToken)) {
          try {
            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken: refreshToken.trim(),
            });

            localStorage.setItem("accessToken", data.accessToken);
            api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

            onRefreshed(data.accessToken);
            isRefreshing = false;

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            delete api.defaults.headers.common.Authorization;

            return Promise.reject(refreshError);
          }
        } else {
          isRefreshing = false;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          delete api.defaults.headers.common.Authorization;
        }
      } else {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;

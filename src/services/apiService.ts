// utils/apiService.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// Define the base URL for API requests - consider moving to env variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      // If token exists, add to headers
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't handle 401 from auth endpoints to prevent loops
      if (originalRequest.url && !originalRequest.url.includes("/auth/")) {
        // Clear auth data
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Reload the page to reset app state
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Wrapper for API requests that handles errors
export const apiRequest = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    let response: AxiosResponse;

    switch (method) {
      case "get":
        response = await apiClient.get(url, config);
        break;
      case "post":
        response = await apiClient.post(url, data, config);
        break;
      case "put":
        response = await apiClient.put(url, data, config);
        break;
      case "delete":
        response = await apiClient.delete(url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data as T;
  } catch (error: any) {
    // Format error response
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      throw (
        error.response.data || {
          message: `Request failed with status ${error.response.status}`,
        }
      );
    } else if (error.request) {
      // Request was made but no response was received
      throw { message: "No response received from server" };
    } else {
      // Error setting up the request
      throw { message: error.message || "Unknown error occurred" };
    }
  }
};

// Export ready-to-use methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>("get", url, undefined, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>("post", url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>("put", url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>("delete", url, undefined, config),
};

export default api;

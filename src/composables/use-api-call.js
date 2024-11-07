import axios from "axios";

const baseUrl = process.env.VUE_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the authorization token
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or wherever it's stored)
    const token = localStorage.getItem("authToken");
    
    // If the token exists, add it to the authorization header
    if (token) {
      config.headers.token = `${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

export { apiClient };

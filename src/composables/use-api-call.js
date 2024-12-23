import axios from "axios";

const baseUrl = process.env.VUE_APP_API_BASE_URL;
const apiClient = axios.create({
  baseURL: baseUrl,

  headers: {
    "Content-Type": "application/json",
  },
});

export { apiClient };

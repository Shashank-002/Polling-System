// src/stores/useAuthStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { apiClient } from "../composables/use-api-call";

export const useAuthStore = defineStore("auth", () => {
  // Local state for email, password, and errors
  const email = ref("");
  const password = ref("");
  const loginError = ref("");

  // Login function to handle API call
  const login = async () => {
    loginError.value = "";

    try {
      const response = await apiClient.post("/user/login", {
        email: email.value,
        password: password.value,
      });

      if (response.data.user && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        return true;
      } else {
        loginError.value = response.data.message || "Login failed.";
        return false;
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        loginError.value = error.response.data.message;
      } else {
        loginError.value = "Login failed. Please try again.";
      }
      return false;
    }
  };

  return {
    email,
    password,
    loginError,
    login,
  };
});

// src/stores/useAuthStore.js
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { apiClient } from "../composables/use-api-call";
export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const authToken = ref(null);

  const login = async (email, password) => {
    let loginError = "";

    try {
      const response = await apiClient.post("/user/login", {
        email: email,
        password: password,
      });

      if (response.data.user && response.data.token) {
        authToken.value = response.data.token;
        user.value = response.data.user;
        localStorage.setItem("authToken", response.data.token);
        return { success: true };
      } else {
        loginError = response.data.message || "Login failed.";
        return { success: false, error: loginError };
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        loginError = error.response.data.message;
      } else {
        loginError = "Login failed. Please try again.";
      }
      return { success: false, error: loginError };
    }
  };

  const isAuthenticated = computed(() => !!authToken.value);

  return {
    user,
    authToken,
    login,
    isAuthenticated,
  };
});

// src/stores/auth-store.js
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { apiClient } from "../composables/use-api-call";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const router = useRouter();
  const authToken = ref(localStorage.getItem("authToken"));

  // Check if there's user data in localStorage and initialize the user
  const storedUser = localStorage.getItem("userData");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }

  // Computed property to check if the user is logged in
  const isAuthenticated = computed(() => !!authToken.value || !!storedUser);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/user/login", {
        email,
        password,
      });

      if (response.data.user && response.data.token) {
        authToken.value = response.data.token;
        user.value = response.data.user;
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        localStorage.setItem("authToken", response.data.token);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.message || "Login failed.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const logout = () => {
    authToken.value = null;
    user.value = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push({ name: "PollLoginPage" });
  };

  return {
    user,
    authToken,
    login,
    logout,
    isAuthenticated,
  };
});

import { defineStore } from "pinia";
import { ref, toRef } from "vue";
import { apiClient } from "../composables/use-api-call";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const state = {
    user: ref(null),
    authToken: ref(localStorage.getItem("authToken")),
  };

  const router = useRouter();
  const user = toRef(state, "user");
  const authToken = toRef(state, "authToken");

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
  };
});

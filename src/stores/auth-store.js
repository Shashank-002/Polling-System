// src/stores/useAuthStore.js
import { defineStore } from "pinia";
import { toRef } from "vue";
import { apiClient } from "../composables/use-api-call";
import { useValidation } from "../composables/login-signup";

export const useAuthStore = defineStore("auth", () => {
  const { state, validateCredentials } = useValidation();

  const login = async () => {
    validateCredentials(); // Validate for login

    if (state.emailError || state.passwordError) {
      return false;
    }

    try {
      const response = await apiClient.post("/user/login", {
        email: state.email,
        password: state.password,
      });

      if (response.data.user && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        return true;
      } else {
        state.loginError = response.data.message || "Login failed.";
        return false;
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        state.loginError = error.response.data.message;
      } else {
        state.loginError = "Login failed. Please try again.";
      }
      return false;
    }
  };

  return {
    email: toRef(state, "email"),
    password: toRef(state, "password"),
    emailError: toRef(state, "emailError"),
    passwordError: toRef(state, "passwordError"),
    loginError: toRef(state, "loginError"),
    validateCredentials,
    login,
  };
});

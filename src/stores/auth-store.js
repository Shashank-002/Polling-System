// src/stores/useAuthStore.js
import { defineStore } from "pinia";
import { reactive, toRef } from "vue";
import { apiClient } from "../composables/use-api-call";

export const useAuthStore = defineStore("auth", () => {
  // Define state as a reactive object
  const state = reactive({
    email: "",
    password: "",
    loginError: "",
  });

  // Login function to handle API call
  const login = async () => {
    state.loginError = "";

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
    loginError: toRef(state, "loginError"),
    login,
  };
});

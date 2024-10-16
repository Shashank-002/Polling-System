// composables/useAuth.js
import { reactive, toRef } from "vue";
import { apiClient } from "./DetailApi";

export function useAuth() {
  // Create a reactive object to hold all authentication fields
  const state = reactive({
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    loginError: "",
  });

  const validateCredentials = (field) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (field === "email" || !field) {
      state.emailError = "";
      if (!state.email) {
        state.emailError = "Email is required.";
      } else if (!emailPattern.test(state.email)) {
        state.emailError = "Please enter a valid email address.";
      }
    }

    if (field === "password" || !field) {
      state.passwordError = "";
      if (!state.password) {
        state.passwordError = "Password is required.";
      }
    }
  };

  const login = async () => {
    validateCredentials();

    if (state.emailError || state.passwordError) {
      return false;
    }

    try {
      const response = await apiClient.post("/", {
        email: state.email,
        password: state.password,
      });

      if (response.data.user && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        return true;
      } else {
        state.loginError = response.data.message;
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
        state.loginError = "Login failed. Please try again";
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
}

import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const baseUrl = process.env.VUE_APP_API_BASE_URL;

export const useAuthStore = defineStore("auth", () => {
  const email = ref("");
  const password = ref("");
  const emailError = ref("");
  const passwordError = ref("");
  const loginError = ref("");

  const validateCredentials = (field) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (field === "email" || !field) {
      emailError.value = "";
      if (!email.value) {
        emailError.value = "Email is required.";
      } else if (!emailPattern.test(email.value)) {
        emailError.value = "Please enter a valid email address.";
      }
    }

    if (field === "password" || !field) {
      passwordError.value = "";
      if (!password.value) {
        passwordError.value = "Password is required.";
      }
    }
  };

  const login = async () => {
    validateCredentials();

    if (emailError.value || passwordError.value) {
      return false;
    }

    try {
      const response = await axios.post(baseUrl, {
        email: email.value,
        password: password.value,
      });

      if (response.data.user && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        return true;
      } else {
        loginError.value = response.data.message;
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
        loginError.value = "Login failed. Please try again";
      }
      return false;
    }
  };

  return {
    email,
    password,
    emailError,
    passwordError,
    loginError,
    validateCredentials,
    login,
  };
});

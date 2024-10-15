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

  // Validate email
  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value) {
      emailError.value = "Email is required.";
    } else if (!emailPattern.test(email.value)) {
      emailError.value = "Please enter a valid email address.";
    } else {
      emailError.value = "";
    }
  };

  // Validate password
  const validatePassword = () => {
    if (!password.value) {
      passwordError.value = "Password is required.";
    } else if (password.value.length < 6) {
      passwordError.value = "Password must be at least 6 characters.";
    } else {
      passwordError.value = "";
    }
  };

  const login = async () => {
    validateEmail();
    validatePassword();

    if (emailError.value || passwordError.value) {
      return false;
    }

    try {
      const response = await axios.post(baseUrl, {
        email: email.value,
        password: password.value,
      });

      // Adjust based on your API's actual response structure
      if (response.data.user && response.data.token) {
        localStorage.setItem("authToken", response.data.token); 
        return true;
      } else {
        loginError.value = "Invalid login credentials.";
        return false;
      }
    } catch (error) {
      loginError.value = "Login failed. Please try again";
      return false;
    }
  };

  return {
    email,
    password,
    emailError,
    passwordError,
    loginError,
    validateEmail,
    validatePassword,
    login,
  };
});

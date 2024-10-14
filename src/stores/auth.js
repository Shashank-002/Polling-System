import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const email = ref("");
  const password = ref("");
  const emailError = ref("");
  const passwordError = ref("");

  // Validate email
  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value) {
      emailError.value = "Email is required.";
    } else if (!emailPattern.test(email.value)) {
      emailError.value = "Please enter a valid email address.";
    } else {
      emailError.value = ""; // Clear error if valid
    }
  };

  // Validate password
  const validatePassword = () => {
    if (!password.value) {
      passwordError.value = "Password is required.";
    } else if (password.value.length < 6) {
      passwordError.value = "Password must be at least 6 characters.";
    } else {
      passwordError.value = ""; // Clear error if valid
    }
  };

  return {
    email,
    password,
    emailError,
    passwordError,
    validateEmail,
    validatePassword,
  };
});

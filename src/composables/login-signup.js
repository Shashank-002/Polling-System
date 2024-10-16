import { reactive } from "vue";

// Function to validate the email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate individual fields
const validateField = (value, fieldName, formData, mode) => {
  if (!value.trim()) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
  }
  if (fieldName === "email" && !isValidEmail(value)) {
    return "Please enter a valid email address.";
  }
  if (fieldName === "password" && mode === "signup" && value.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if (fieldName === "confirmPassword" && value !== formData.password) {
    return "Passwords do not match.";
  }
  return "";
};

// Function to validate the entire form
export const validateForm = (formData, mode) => {
  const errors = {};
  let isFormValid = true;

  Object.keys(formData).forEach((key) => {
    const errorData = validateField(formData[key], key, formData, mode);
    errors[key] = errorData;
    if (errorData) {
      isFormValid = false;
    }
  });

  return { errors, isFormValid };
};

// Main validation composable
export const useValidation = () => {
  const state = reactive({
    email: "",
    password: "",
    confirmPassword: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const validateCredentials = (mode) => {
    // Reset errors before validation
    state.emailError = "";
    state.passwordError = "";
    state.confirmPasswordError = "";

    const { errors, isFormValid } = validateForm(state, mode);
    state.emailError = errors.email || "";
    state.passwordError = errors.password || "";

    return isFormValid;
  };

  return {
    state,
    validateCredentials,
  };
};

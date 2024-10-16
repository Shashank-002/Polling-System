import { reactive } from "vue";

export const useValidation = () => {
  const state = reactive({
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
  });

  const validateCredentials = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear previous errors
    state.emailError = "";
    state.passwordError = "";

    if (!state.email) {
      state.emailError = "Email is required.";
    } else if (!emailPattern.test(state.email)) {
      state.emailError = "Please enter a valid email address.";
    }

    if (!state.password) {
      state.passwordError = "Password is required.";
    }
  };

  return {
    state,
    validateCredentials,
  };
};

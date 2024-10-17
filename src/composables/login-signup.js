import { ref } from "vue";
import { useAuthStore } from "@/stores/auth-store";

const authStore = useAuthStore();
export const useValidation = () => {
  const state = ref({
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
  });

  const validateCredentials = (field) => {
    state.value.emailError = "";
    state.value.passwordError = "";

    if (field === "email" || field === undefined) {
      if (!state.value.email) {
        state.value.emailError = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(state.value.email)) {
        state.value.emailError = "Please enter a valid email address";
      } else {
        authStore.email = state.value.email;
      }
    }

    if (field === "password" || field === undefined) {
      if (!state.value.password) {
        state.value.passwordError = "Password is required";
      } else {
        authStore.password = state.value.password;
      }
    }

    return !state.value.emailError && !state.value.passwordError;
  };

  return {
    state,
    validateCredentials,
  };
};

import { useAuthStore } from "@/stores/auth-store";

const emailRegex = /\S+@\S+\.\S+/;

export const useValidation = (formData, formErrors) => {
  const authStore = useAuthStore();

  const validateCredentials = (field) => {
    // Validate email
    if (field === "email" || field === undefined) {
      formErrors.emailError = ""; 

      if (!formData.email) {
        formErrors.emailError = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        formErrors.emailError = "Please enter a valid email address";
      } else {
        authStore.email = formData.email; 
      }

      if (!formErrors.emailError && formData.password) {
        formErrors.passwordError = "";
      }
    }

    // Validate password
    if (field === "password" || field === undefined) {
      formErrors.passwordError = ""; 
      if (!formData.password) {
        formErrors.passwordError = "Password is required";
      } else {
        authStore.password = formData.password;
      }
    }

    return !formErrors.emailError && !formErrors.passwordError;
  };

  return {
    validateCredentials,
  };
};

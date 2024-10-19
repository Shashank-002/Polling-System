import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import {
  isValidEmail,
  isValidPassword,
  validateField,
} from "@/composables/validations";
import { toast } from "vue3-toastify";

export const useLogin = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const formData = ref({
    email: "",
    password: "",
  });

  const formErrors = ref({
    emailError: "",
    passwordError: "",
  });

  const loading = ref(false);

  const validateCredentials = () => {
    let isValid = true;

    // Reset errors
    formErrors.value.emailError = "";
    formErrors.value.passwordError = "";

    // Validate email
    const emailError = validateField(formData.value.email, "email");
    if (emailError) {
      formErrors.value.emailError = emailError;
      isValid = false;
    } else if (!isValidEmail(formData.value.email)) {
      formErrors.value.emailError = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate password
    const passwordError = validateField(formData.value.password, "password");
    if (passwordError) {
      formErrors.value.passwordError = passwordError;
      isValid = false;
    } else if (!isValidPassword(formData.value.password)) {
      formErrors.value.passwordError = "Password is required.";
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    loading.value = true;

    const isValid = validateCredentials();
    if (!isValid) {
      loading.value = false;
      return;
    }

    const { email, password } = formData.value;
    const loginResponse = await authStore.login(email, password);

    if (loginResponse.success) {
      router.push("/poll-list");
    } else {
      toast.error(loginResponse.error, {
        theme: "colored",
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }

    loading.value = false; // Stop loading after response handling
  };

  return {
    loading,
    handleLogin,
    formData,
    formErrors,
    validateCredentials,
  };
};

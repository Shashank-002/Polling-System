import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import { validateForm, validateField } from "@/composables/validations";
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

  // Function to handle form submission and validation
  const handleLogin = async () => {
    loading.value = true;

    // Validate entire form
    const { errors, isFormValid } = validateForm(formData.value);
    formErrors.value = {
      emailError: errors.email || "",
      passwordError: errors.password || "",
    };

    // Stop the process if the form is invalid
    if (!isFormValid) {
      loading.value = false;
      return;
    }

    // Proceed with login if the form is valid
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

    loading.value = false;
  };

  // Function to validate a specific field dynamically
  const validateFieldError = (field) => {
    const error = validateField(formData.value[field], field);
    formErrors.value[`${field}Error`] = error;
  };

  return {
    loading,
    handleLogin,
    formData,
    formErrors,
    validateFieldError,
  };
};

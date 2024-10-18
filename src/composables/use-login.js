import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useValidation } from "@/composables/login-signup";
import { useAuthStore } from "@/stores/auth-store";

export const useLogin = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  // Define formData and formErrors objects
  const formData = ref({
    email: "",
    password: "",
  });

  const formErrors = ref({
    emailError: "",
    passwordError: "",
  });

  // Pass formData and formErrors to useValidation
  const { validateCredentials } = useValidation(
    formData.value,
    formErrors.value
  );

  const loading = ref(false);

  const handleLogin = async () => {
    loading.value = true;

    // Perform validation
    const isValid = validateCredentials();

    if (!isValid) {
      loading.value = false;
      return; 
    }

    const loginSuccess = await authStore.login();

    if (loginSuccess) {
      router.push("/poll-list");
    } else {
      toast.error(authStore.loginError, {
        theme: "colored",
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }

    loading.value = false;
  };

  return {
    loading,
    handleLogin,
    formData,
    formErrors,
    validateCredentials,
  };
};

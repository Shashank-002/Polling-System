import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth-store';

export const useLogin = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const loading = ref(false); // Ensure loading is initialized to false

  const handleLogin = async () => {
    loading.value = true; // Show the loader only after login starts

    // Validate credentials
    authStore.validateCredentials('email');
    authStore.validateCredentials('password');

    // If there are validation errors, stop the loader
    if (authStore.emailError || authStore.passwordError) {
      loading.value = false;
      return;
    }

    // Attempt login
    const loginSuccess = await authStore.login();

    if (loginSuccess) {
      router.push("/poll-list");
    } else {
      toast.error(authStore.loginError, {
        theme: 'colored',
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    
    loading.value = false;
  };

  return {
    loading, 
    handleLogin,
  };
};

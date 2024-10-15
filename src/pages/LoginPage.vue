<template>
    <div class="flex items-center justify-center">
        <div class="w-full max-w-md bg-black p-1 rounded-md">
            <form @submit.prevent="handleLogin" class="bg-white shadow-lg rounded-lg px-8 py-10">
                <h2 class="text-center text-3xl font-extrabold mb-6">
                    Login
                </h2>

                <div class="mb-4">
                    <label class="block text-gray-600 text-left font-semibold mb-2" for="email">
                        Email Address
                    </label>
                    <input type="email" id="email" v-model="authStore.email"
                        @input="authStore.validateCredentials('email')" @keydown.enter.prevent
                        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                        placeholder="you@example.com" />
                    <p v-if="authStore.emailError" class="text-red-500 text-sm text-left mt-2">{{ authStore.emailError
                        }}</p>
                </div>

                <div class="mb-6 relative min-h-[110px]">
                    <label class="block text-gray-600 text-left font-semibold mb-2" for="password">
                        Password
                    </label>
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="authStore.password"
                        @input="authStore.validateCredentials('password')" @keydown.enter.prevent
                        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out pr-10"
                        placeholder="Enter your password" />
                    <button type="button" @click="togglePasswordVisibility"
                        class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                        style="top: 50%; transform: translateY(-50%);">
                        <span v-if="showPassword"><font-awesome-icon :icon="['fas', 'eye']" /></span>
                        <span v-else><font-awesome-icon :icon="['fas', 'eye-slash']" /></span>
                    </button>
                    <p v-if="authStore.passwordError" class="text-red-500 text-sm text-left mt-2">{{
                        authStore.passwordError }}</p>
                </div>

                <div class="flex items-center justify-center">
                    <button type="submit"
                        class="w-full h-12 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out flex items-center justify-center"
                        :disabled="loading">
                        <template v-if="loading">
                            <svg aria-hidden="true"
                                class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill" />
                            </svg>
                        </template>
                        <template v-else>
                            Login
                        </template>
                    </button>
                </div>

                <p class="text-center text-gray-600 mt-6 text-sm">
                    Don't have an account? <a href="#" class="text-blue-500 hover:underline">Sign Up</a>
                </p>
            </form>
        </div>
    </div>
</template>


<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const authStore = useAuthStore();
const router = useRouter();
const showPassword = ref(false);
const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;

    // Perform input validation first
    authStore.validateCredentials(); // This validates both email and password fields

    // If there are any validation errors, do not proceed with login
    if (authStore.emailError || authStore.passwordError) {
        loading.value = false;
        return;  // Stop the function if there are validation errors
    }

    // If validation passes, proceed to login
    const loginSuccess = await authStore.login();

    // Show appropriate toast message based on login result
    if (loginSuccess) {
        router.push("/poll-list");  // Navigate if login is successful
    } else {
        // Show toast error if login failed
        toast.error(authStore.loginError, {
            theme: 'colored',
            position: toast.POSITION.BOTTOM_CENTER
        });
    }

    loading.value = false;
};

// Function to toggle password visibility
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
</script>

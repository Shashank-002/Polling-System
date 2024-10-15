<template>
    <div class="flex items-center justify-center">
        <div class="w-full max-w-md">
            <form @submit.prevent="handleLogin" class="bg-white shadow-lg rounded-lg px-8 py-10">
                <h2
                    class="text-center text-3xl font-extrabold bg-gradient-to-r from-teal-400 via-cyan-500 to-pink-500 bg-clip-text text-transparent uppercase mb-6">
                    Login Page
                </h2>

                <div class="mb-4">
                    <label class="block text-gray-700 text-left font-semibold mb-2" for="email">
                        Email Address
                    </label>
                    <input type="email" id="email" v-model="authStore.email" @input="authStore.validateEmail"
                        @keydown.enter.prevent
                        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                        placeholder="you@example.com" />
                    <p v-if="authStore.emailError" class="text-red-500 text-sm text-left mt-2">{{ authStore.emailError
                        }}</p>
                </div>

                <div class="mb-6 relative min-h-[110px]">
                    <label class="block text-gray-700 text-left font-semibold mb-2" for="password">
                        Password
                    </label>
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="authStore.password"
                        @input="authStore.validatePassword" @keydown.enter.prevent
                        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out pr-10"
                        placeholder="Enter your password" />
                    <button type="button" @click="togglePasswordVisibility"
                        class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                        style="top: 50%; transform: translateY(-50%);">
                        <span v-if="showPassword"><font-awesome-icon :icon="['fas', 'eye-slash']" /></span>
                        <span v-else><font-awesome-icon :icon="['fas', 'eye']" /></span>
                    </button>
                    <p v-if="authStore.passwordError" class="text-red-500 text-sm text-left mt-2">{{
                        authStore.passwordError }}</p>
                </div>

                <!-- Show API Login error if any -->
                <p v-if="authStore.loginError" class="text-red-500 text-center mb-4">{{ authStore.loginError }}</p>

                <div class="flex items-center justify-center">
                    <button type="submit"
                        class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out">
                        Login
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

const authStore = useAuthStore();
const router = useRouter();
const showPassword = ref(false);

const handleLogin = async () => {
    const loginSuccess = await authStore.login();

    // Navigate only if there are no errors
    if (loginSuccess) {
        router.push("/poll-list");
    } else {
        console.log("Login failed, not redirecting.");
    }
};


// Function to toggle password visibility
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
</script>

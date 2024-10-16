<template>
    <div class="flex items-center justify-center">
        <div class="w-full max-w-md">
            <form @submit.prevent="handleLogin"
                class="bg-white border border-slate-900 rounded-lg px-8 py-10 shadow-lg">
                <h2 class="text-center text-3xl font-extrabold mb-6">Login</h2>

                <div class="mb-4">
                    <label class="block text-gray-600 text-left font-semibold mb-2" for="email">
                        Email Address
                    </label>
                    <input type="email" id="email" v-model="email" @input="validateCredentials('email')"
                        @keydown.enter.prevent
                        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                        placeholder="Email" />
                    <p v-if="emailError" class="text-red-500 text-sm text-left mt-2">{{ emailError }}</p>
                </div>

                <div class="mb-6 relative min-h-[110px]">
                    <label class="block text-gray-600 text-left font-semibold mb-2" for="password">
                        Password
                    </label>
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                        @input="validateCredentials('password')" @keydown.enter.prevent
                        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out pr-10"
                        placeholder="Password" />
                    <button type="button" @click="togglePasswordVisibility"
                        class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                        style="top: 50%; transform: translateY(-50%);">
                        <span v-if="showPassword"><font-awesome-icon :icon="['fas', 'eye']" /></span>
                        <span v-else><font-awesome-icon :icon="['fas', 'eye-slash']" /></span>
                    </button>
                    <p v-if="passwordError" class="text-red-500 text-sm text-left mt-2">{{ passwordError }}</p>
                </div>

                <div class="flex items-center justify-center">
                    <button type="submit"
                        class="w-full h-12 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                        :class="loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'"
                        :disabled="loading">
                        <template v-if="loading">
                            <i class="fas fa-circle-notch fa-spin text-xl"></i>
                        </template>
                        <template v-else>Login</template>
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
import { useAuth } from '@/composables/LoginSignup';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const { email, password, emailError, passwordError, validateCredentials, login, loginError } = useAuth();
const router = useRouter();
const showPassword = ref(false);
const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;

    // Validate credentials and assign errors
    validateCredentials('email');
    validateCredentials('password');

    if (emailError.value || passwordError.value) {
        loading.value = false;
        return;
    }

    const loginSuccess = await login();

    // Check login success
    if (loginSuccess) {
        router.push("/poll-list");
    } else {
        toast.error(loginError.value, {
            theme: 'colored',
            position: toast.POSITION.BOTTOM_CENTER
        });
    }

    loading.value = false;
};


const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
</script>

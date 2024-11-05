<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-11/12  max-w-md ">
      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="bg-white border border-slate-900 rounded-lg px-8 py-10 shadow-lg ">
        <h2 class="text-center text-3xl font-extrabold mb-6">Login</h2>

        <!-- Email input -->
        <div class="mb-4">
          <label class="block text-gray-600 text-left font-semibold mb-2" for="email">
            Email Address
          </label>
          <input type="email" id="email" v-model="formData.email" @input="validateFieldError('email')"
            @keydown.enter.prevent
            class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            placeholder="Email" />
          <p v-if="formErrors.emailError" class="text-red-500 text-sm text-left mt-2">{{ formErrors.emailError }}</p>
        </div>

        <!-- Password input -->
        <div class="mb-6">
          <label class="block text-gray-600 text-left font-semibold mb-2" for="password">
            Password
          </label>
          <PasswordToggle :password="formData.password" @input="(event) => {
            formData.password = event;
            validateFieldError('password');
          }" />
          <p v-if="formErrors.passwordError" class="text-red-500 text-sm text-left mt-2">{{ formErrors.passwordError }}
          </p>
        </div>

        <!-- Login button -->
        <div class="flex items-center justify-center">
          <BaseButton :isLoading="loading" :buttonText="'Login'" @click="handleLogin" />
        </div>

        <!-- Sign-up Link -->
        <p class="text-center text-gray-600 mt-6 text-sm">
          Don't have an account? <RouterLink to="/signup"><span class="text-blue-500">Sign up</span></RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useLogin } from '@/composables/use-login';
import PasswordToggle from '@/components/PasswordToggle.vue';
import BaseButton from '@/components/BaseButton.vue';

// Destructure properties from useLogin
const { loading, handleLogin, formData, formErrors, validateFieldError } = useLogin();
</script>

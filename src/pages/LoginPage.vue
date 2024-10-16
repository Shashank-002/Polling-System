<template>
    <div class="flex items-center justify-center">
      <div class="w-full max-w-md">
        <form @submit.prevent="login.handleLogin" class="bg-white border border-slate-900 rounded-lg px-8 py-10 shadow-lg">
          <h2 class="text-center text-3xl font-extrabold mb-6">Login</h2>
  
          <!-- Email input -->
          <div class="mb-4">
            <label class="block text-gray-600 text-left font-semibold mb-2" for="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              v-model="authStore.email"
              @input="authStore.validateCredentials('email')" @keydown.enter.prevent
              class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
              placeholder="Email"
            />
            <p v-if="authStore.emailError" class="text-red-500 text-sm text-left mt-2">{{ authStore.emailError }}</p>
          </div>
  
          <!-- Password input -->
          <div class="mb-6">
            <label class="block text-gray-600 text-left font-semibold mb-2" for="password">
              Password
            </label>
            <PasswordToggle :password="authStore.password"  @input="authStore.password = $event" />
            <p v-if="authStore.passwordError" class="text-red-500 text-sm text-left mt-2">{{ authStore.passwordError }}</p>
          </div>
  
          <!-- Login button with loading state -->
          <div class="flex items-center justify-center">
            <BaseButton :isLoading="loading" @click="handleLogin">
              Login
            </BaseButton>
          </div>
  
          <p class="text-center text-gray-600 mt-6 text-sm">
            Don't have an account? <a href="#" class="text-blue-500 hover:underline">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useLogin } from '@/composables/use-login';
  import { useAuthStore } from '@/stores/auth-store';
  import PasswordToggle from '@/components/PasswordToggle.vue';
  import BaseButton from '@/components/BaseButton.vue';
  
  const authStore = useAuthStore(); 
  const {loading, handleLogin} = useLogin(); // This is where loading is tracked and handled
  </script>
  
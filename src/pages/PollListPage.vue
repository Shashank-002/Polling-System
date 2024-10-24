<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-2xl uppercase font-bold">Poll Page</h1>
      <p class="text-red-500">No poll available! at the moment.</p>

      <!-- Logout button -->
      <button @click="logout"
        class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth-store";

const authStore = useAuthStore();

// Function to handle logout
const logout = () => {
  authStore.logout();
};
</script>
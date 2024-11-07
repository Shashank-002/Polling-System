<!-- <template>
  <div id="app">
    <Navbar v-if="isUserLoggedIn" />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth-store'
import Navbar from '@/components/PollNavbar.vue'

const authStore = useAuthStore()

const isUserLoggedIn = computed(() => {
  return authStore.user !== null || authStore.user !== '';
})
console.log('sfvsf',isUserLoggedIn);
</script> -->

<template>
  <div id="app">
    <Navbar v-if="isUserLoggedIn" />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import Navbar from '@/components/PollNavbar.vue';

const authStore = useAuthStore();

// Load user data on app load if it exists in local storage
onMounted(() => {
  if (localStorage.getItem("userData")) {
    authStore.loadUserData(); // Ensure this loads any stored user data to the store
  }
});

const isUserLoggedIn = computed(() => {
  return authStore.user && authStore.user.value !== null;
});
</script>


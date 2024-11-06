<template>
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
  return authStore.user;
})
</script>

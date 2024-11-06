<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/PollNavbar.vue'

const route = useRoute()
const showNavbar = computed(() => {
  const noNavbarRoutes = ['PollLoginPage', 'SignupPage']
  return !noNavbarRoutes.includes(route.name)
})
</script>

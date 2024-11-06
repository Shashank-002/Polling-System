<template>
  <div>
    <Navbar />
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="text-center">
        <h1 class="text-2xl uppercase font-bold">Poll Page</h1>
        <p class="text-red-500">No poll available! at the moment.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/PollNavbar.vue'
</script>


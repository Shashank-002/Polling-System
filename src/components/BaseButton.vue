
<template>
  <button type="button" :class="[
    'w-full h-12 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-200',
    isLoading ? 'bg-gray-400 cursor-not-allowed' : buttonClass
  ]" :disabled="isLoading" @click="onClick">

    <template v-if="isLoading">
      <i class="fas fa-circle-notch fa-spin text-xl"></i>
    </template>

    <template v-else>
      {{ buttonText }}
    </template>
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  buttonClass: {
    type: String,
    default: 'bg-blue-500 hover:bg-blue-600',
  },
  onClick: {
    type: Function,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

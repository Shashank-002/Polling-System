<!-- NavItem.vue -->
<template>
    <router-link
      :to="item.to"
      :class="['py-2 px-4', isActive ? 'bg-teal-500 text-white rounded-md shadow-lg' : 'text-white']"
      active-class="bg-teal-500 text-white rounded-md shadow-lg"
    >
      {{ item.label }}
    </router-link>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
   defineProps({
    item: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  });
  </script>

  
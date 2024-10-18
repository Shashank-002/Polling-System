<!-- src/components/PasswordToggle.vue -->
<template>
  <div class="relative ">
    <input :type="showPassword ? 'text' : 'password'" :value="password" @input="updatePassword" @keydown.enter.prevent
      class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out pr-10"
      placeholder="Password" />
    <button type="button" @click="togglePasswordVisibility"
      class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
      style="top: 50%; transform: translateY(-50%);">
      <span v-if="showPassword"><font-awesome-icon :icon="['fas', 'eye']" /></span>
      <span v-else><font-awesome-icon :icon="['fas', 'eye-slash']" /></span>
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  password: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['input']);
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const updatePassword = (event) => {
  emit('input', event.target.value);
};
</script>
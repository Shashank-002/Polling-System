<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h2 class="text-xl font-bold mb-4">Success!</h2>
            <p class="mb-6">{{ message }}</p>
            <button @click="closeModal"
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                OK
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    message: String,
    isOpen: Boolean,
});

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};
</script>

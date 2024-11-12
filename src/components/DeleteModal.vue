<!-- src/components/DeleteModal.vue -->
<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity">
        <div class="bg-white p-8 rounded-lg shadow-xl w-96 transform transition-transform scale-95">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Delete Poll</h3>
            <p class="text-gray-600 mb-6">Are you sure you want to delete this poll? This action cannot be undone.</p>
            <div class="flex justify-end space-x-4">
                <button @click="onCancel"
                    class="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition duration-200 ease-in-out">
                    Cancel
                </button>
                <button @click="onDelete"
                    class="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-200 ease-in-out">
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['delete', 'cancel']);

const onDelete = () => {
    emit('delete');
};

const onCancel = () => {
    emit('cancel');
};
</script>
<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg w-11/12 md:w-1/2">
            <div class="flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-800">Poll Results</h3>
                <button @click="close" class="text-red-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mt-4">
                <BarChart :poll="poll" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import BarChart from './BarChart.vue';
defineProps({
    poll: Object,
});
const emit = defineEmits(['close']);

const isVisible = ref(true);

// Close the modal
const close = () => {
    emit('close');
    isVisible.value = false;
};
</script>
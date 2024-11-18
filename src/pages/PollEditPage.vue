<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 class="text-xl text-center font-semibold text-red-500 mb-4">
                {{ isEditMode ? 'Poll Edit Page' : 'Add Poll' }}
            </h2>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const pollId = router.currentRoute.value.params.id; 
const isEditMode = ref(false);

// Check if we're editing an existing poll
onMounted(() => {
    if (pollId) {
        isEditMode.value = true; 
    }
});
</script>

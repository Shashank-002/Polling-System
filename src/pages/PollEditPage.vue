<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Edit Poll</h2>


            <div class="mb-4">
                <label for="pollTitle" class="block text-sm font-medium text-gray-700">Poll Title</label>
                <input v-model="poll.title" id="pollTitle" type="text"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>

            <div v-for="(option) in poll.options" :key="option.id" class="mb-4">
                <div class="flex justify-between items-center">
                    <input v-model="option.optionTitle" type="text"
                        class="p-2 border border-gray-300 rounded-md w-4/5" />
                    <div class="flex space-x-2">
                        <button @click="editOption(option)" class="text-blue-500 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button @click="deleteOption(option.id)" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <input v-model="newOption" type="text" placeholder="New Option"
                    class="p-2 border border-gray-300 rounded-md w-4/5" />
                <button @click="addOption" class="mt-2 bg-teal-500 text-white px-4 py-2 rounded-md">Add Option</button>
            </div>

            <button @click="submitPoll" class="w-full bg-blue-600 text-white py-2 rounded-md">Submit</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePollsStore } from '../stores/polls-store';
import { useRouter } from 'vue-router';

const pollsStore = usePollsStore();
const router = useRouter();

const pollId = router.currentRoute.value.params.id;  // Get poll ID from route params
const poll = ref({
    title: '',
    options: []
});

const newOption = ref('');

//   onMounted(async () => {
//     // Fetch the poll details using the pollId
//     const currentPoll = await pollsStore.fetchPollById(pollId);
//     poll.value = currentPoll;
//   });

// Add new option
const addOption = () => {
    if (newOption.value.trim() !== '') {
        poll.value.options.push({
            id: Date.now(),
            optionTitle: newOption.value.trim(),
        });
        newOption.value = '';
    }
};

// Edit option - This can be extended to implement complex editing if needed
const editOption = (option) => {
    const updatedOptionTitle = prompt('Edit Option', option.optionTitle);
    if (updatedOptionTitle !== null) {
        option.optionTitle = updatedOptionTitle;
    }
};

// Delete option
const deleteOption = (optionId) => {
    const index = poll.value.options.findIndex(option => option.id === optionId);
    if (index !== -1) {
        poll.value.options.splice(index, 1);
    }
};

// Submit updated poll
const submitPoll = async () => {
    try {
        await pollsStore.updatePoll(pollId, poll.value);
        router.push('/poll-list');  // Redirect to the poll list page after submission
    } catch (error) {
        alert(error.message);
    }
};
</script>
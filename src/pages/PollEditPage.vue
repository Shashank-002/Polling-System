<!-- <template>
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
</script> -->




<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
                {{ isEditMode ? 'Edit Poll' : 'Add Poll' }}
            </h2>

            <!-- Poll Title -->
            <div class="mb-4">
                <label for="pollTitle" class="block text-sm font-medium text-gray-700">Poll Title</label>
                <input v-model="poll.title" id="pollTitle" type="text"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter poll title" />
                <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
            </div>

            <!-- Poll Options -->
            <div v-for="(option, index) in poll.options" :key="option.id" class="mb-4">
                <div class="flex justify-between items-center">
                    <input v-model="option.optionTitle" type="text"
                        class="p-2 border border-gray-300 rounded-md w-4/5" placeholder="Enter option"
                        @input="validateOption(index)" />
                    <div class="flex space-x-2">
                        <button @click="editOption(option)" class="text-blue-500 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button @click="deleteOption(option.id)" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <p v-if="errors.options[index]" class="text-red-500 text-sm mt-1">{{ errors.options[index] }}</p>
            </div>

            <!-- Add New Option -->
            <div class="mb-4">
                <input v-model="newOption" type="text" placeholder="New Option"
                    class="p-2 border border-gray-300 rounded-md w-4/5" />
                <button @click="addOption" class="mt-2 bg-teal-500 text-white px-4 py-2 rounded-md">Add Option</button>
            </div>

            <!-- Submit Button -->
            <button @click="submitPoll" class="w-full bg-blue-600 text-white py-2 rounded-md">
                {{ isEditMode ? 'Update Poll' : 'Add Poll' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
const errors = ref({
    title: '',
    options: []
});

const isEditMode = ref(false);

// Validate title and options
const validateField = (field, index = null) => {
    if (field === 'title') {
        errors.value.title = poll.value.title.trim() ? '' : 'Poll title is required';
    }
    if (field === 'options' && index !== null) {
        errors.value.options[index] = poll.value.options[index].optionTitle.trim() ? '' : 'Option cannot be empty';
    }
};

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

// Edit option
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

// Submit poll form
const submitPoll = async () => {
    validateField('title');
    poll.value.options.forEach((_, index) => validateField('options', index));

    if (!errors.value.title && !errors.value.options.some(error => error !== '')) {
        try {
            if (isEditMode.value) {
                await pollsStore.updatePoll(pollId, poll.value);
            } else {
                await pollsStore.addPoll(poll.value);
            }
            router.push('/poll-list');  // Redirect to the poll list page after submission
        } catch (error) {
            alert(error.message);
        }
    }
};

// Fetch poll details for editing
onMounted(async () => {
    if (pollId) {
        isEditMode.value = true;
        try {
            // const currentPoll = await pollsStore.fetchPollById(pollId);
            // if (currentPoll) {
            //     poll.value = currentPoll;
            // } 
            // else {
            //     alert('Poll not found');
            //     router.push('/');
            // }
        } 
        catch (error) {
            alert(error.message);
        }
    }
});
</script>

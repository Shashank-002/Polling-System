<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <p v-if="loading" class="text-blue-500">
      <i class="fas fa-spinner fa-spin fa-3x"></i>
    </p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <div v-if="!loading && polls.length > 0"
      class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl px-4 mt-28 mb-8">
      <div v-for="poll in polls" :key="poll.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg p-6 transition-shadow duration-300 flex flex-col">
        <div v-if="isAdmin" class="flex justify-end space-x-4 mb-4">
          <button @click="showDeleteModal(poll.id)" class="text-red-500">
            <i class="fas fa-trash-alt"></i>
          </button>
          <button class="text-blue-500">
            <router-link :to="`/edit-poll/${poll.id}`" class="text-blue-500">
              <i class="fas fa-edit"></i>
            </router-link>
          </button>
          <button class="text-green-500 " @click="showChartModal(poll)">
            <i class="fas fa-bar-chart"></i>
          </button>
        </div>
        <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ poll.title }}</h2>
        <ul class="mt-2 space-y-3 flex-1">
          <li v-for="option in poll.options" :key="option.id" class="flex items-center">
            <input type="radio" :name="'poll_' + poll.id" :value="option.optionTitle" class="h-4 w-4 focus:ring-0"
              :disabled="hasVoted(poll.id, userId) || voting[poll.id]" :checked="selectedOptions[poll.id] === option.id"
              @change="selectedOptions[poll.id] = option.id"
              :class="{ 'bg-blue-600': selectedOptions[poll.id] === option.id }" />
            <label class="ml-2 text-gray-700 text-sm">
              {{ option.optionTitle }}
            </label>
          </li>
        </ul>
        <button @click="submitVote(poll.id)"
          :disabled="hasVoted(poll.id, userId) || !selectedOptions[poll.id] || voting[poll.id]" :class="{
            'bg-blue-600 hover:bg-blue-700': !hasVoted(poll.id, userId) && !voting[poll.id],
            'bg-gray-400 cursor-not-allowed': hasVoted(poll.id, userId) || voting[poll.id]
          }"
          class="mt-4 w-full text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
          {{ hasVoted(poll.id, userId) ? "Voted" : "Vote" }}
        </button>
      </div>
    </div>
    <BarChartModal v-if="showChart" :poll="selectedPoll" @close="closeChartModal" />
    <DeleteModal v-if="deleteModalVisible" @delete="confirmDelete" @cancel="deleteModalVisible = false" />
    <p v-if="!loading && polls.length === 0 && !error" class="text-red-500 mt-4">
      No poll available at the moment.
    </p>
  </div>
</template>

<script setup>
import { usePollsStore } from "../stores/polls-store";
import { onMounted, ref, computed } from "vue";
import { useAuthStore } from "../stores/auth-store";
import DeleteModal from '../components/DeleteModal.vue'
import BarChartModal from '../components/BarChartModal.vue'
import { ADMIN_ROLE_ID } from '../composables/constants'

const pollsStore = usePollsStore();
const authStore = useAuthStore();
const { polls, error, fetchPolls, voteForOption, hasVoted, deletePoll } = pollsStore;

const loading = ref(true);
const selectedOptions = ref({});
const voting = ref({});
const showChart = ref(false);
const selectedPoll = ref(null);
const deleteModalVisible = ref(false);
const pollIdToDelete = ref(null);

const loggedInUser = authStore.user.value || JSON.parse(localStorage.getItem("userData"));
const userId = loggedInUser ? loggedInUser.id : null;

// Admin check
const isAdmin = computed(() => loggedInUser?.roleId === ADMIN_ROLE_ID);

const submitVote = async (pollId) => {
  const optionId = selectedOptions.value[pollId];
  if (!optionId) return;

  voting.value[pollId] = true;

  try {
    await voteForOption(pollId, optionId);
    const votedOptions = JSON.parse(localStorage.getItem(`votedOptions_${userId}`)) || {};
    votedOptions[pollId] = optionId;
    localStorage.setItem(`votedOptions_${userId}`, JSON.stringify(votedOptions));
    await fetchPolls();
  } catch (error) {
    alert(error.message);
  } finally {
    voting.value[pollId] = false;
  }
};

// Display delete modal
const showDeleteModal = (id) => {
  pollIdToDelete.value = id;
  deleteModalVisible.value = true;
};

// Confirm delete action
const confirmDelete = async () => {
  try {
    await deletePoll(pollIdToDelete.value);
    deleteModalVisible.value = false;
    pollIdToDelete.value = null;
    await fetchPolls();
  } catch (error) {
    console.error("Failed to delete poll:", error);
  }
};

const showChartModal = (poll) => {
  selectedPoll.value = poll;
  showChart.value = true;
};

// Close bar chart modal
const closeChartModal = () => {
  showChart.value = false;
  selectedPoll.value = null;
};

onMounted(async () => {
  const votedOptions = JSON.parse(localStorage.getItem(`votedOptions_${userId}`)) || {};
  selectedOptions.value = { ...votedOptions };

  setTimeout(async () => {
    await fetchPolls();
    loading.value = false;
  }, 500);
});
</script>

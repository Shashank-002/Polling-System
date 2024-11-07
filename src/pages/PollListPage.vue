<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <p v-if="loading" class="text-blue-500">
      <i class="fas fa-spinner fa-spin fa-3x"></i>
    </p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <div v-if="!loading && polls.length > 0"
      class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl px-4 mt-28 mb-8">
      <div v-for="poll in polls" :key="poll.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg p-6 transition-shadow duration-300">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ poll.title }}</h2>
        <ul class="mt-2 space-y-3">
          <li v-for="option in poll.options" :key="option.id" class="flex items-center">
            <input type="radio" :name="'poll_' + poll.id" :value="option.optionTitle"
              class="h-4 w-4 text-blue-600 focus:ring-0" :disabled="hasVoted(poll.id)"
              @change="selectedOptions[poll.id] = option.id" />
            <label class="ml-2 text-gray-700 text-sm">{{ option.optionTitle }}</label>
          </li>
        </ul>
        <button @click="submitVote(poll.id)" :disabled="hasVoted(poll.id) || !selectedOptions[poll.id]"
          class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
          {{ hasVoted(poll.id) ? "Voted" : "Vote" }}
        </button>
      </div>
    </div>
    <p v-if="!loading && polls.length === 0 && !error" class="text-red-500 mt-4">
      No poll available at the moment.
    </p>
  </div>
</template>

<script setup>
import { usePollsStore } from "../stores/polls-store";
import { onMounted, ref } from "vue";

const pollsStore = usePollsStore();
const { polls, error, fetchPolls, voteForOption, hasVoted } = pollsStore;

const loading = ref(true);
const selectedOptions = ref({});

const submitVote = async (pollId) => {
  const optionId = selectedOptions.value[pollId];
  if (!optionId) return;

  try {
    await voteForOption(pollId, optionId);
    alert("Vote created successfully");
  } catch (error) {
    alert(error.message);
  }
};

onMounted(async () => {
  setTimeout(async () => {
    await fetchPolls();
    loading.value = false;
  }, 500);
});
</script>

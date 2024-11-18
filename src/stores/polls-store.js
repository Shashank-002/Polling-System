import { defineStore } from "pinia";
import { ref } from "vue";
import { apiClient } from "../composables/use-api-call";
import { useAuthStore } from "./auth-store"; // Import auth store

export const usePollsStore = defineStore("polls", () => {
  const polls = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const hasMorePolls = ref(true);
  const page = ref(1); // Track the current page for pagination

  const fetchPolls = async () => {
    if (!hasMorePolls.value || loading.value) return; // Prevent simultaneous calls
    loading.value = true;
    error.value = null;

    try {
      // Fetch a single page of polls
      const response = await apiClient.get(`/poll/list/${page.value}?limit=10`);
      console.log("response", response);
      const pollsFromServer = response.data.rows.map((poll) => ({
        id: poll.id,
        title: poll.title,
        options: poll.optionList || [],
      }));

      // Add unique polls to the list
      const fetchedPollIds = new Set(polls.value.map((poll) => poll.id)); // Track existing poll IDs
      polls.value.push(
        ...pollsFromServer.filter((poll) => !fetchedPollIds.has(poll.id))
      );

      // Check if more polls are available
      if (pollsFromServer.length < 10) {
        hasMorePolls.value = false;
      } else {
        page.value += 1; // Increment page for the next fetch
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to fetch polls.";
    } finally {
      loading.value = false;
    }
  };

  const resetPolls = () => {
    polls.value = [];
    page.value = 1;
    hasMorePolls.value = true;
  };

  // Retrieve voting history for the logged-in user from localStorage
  const getVotedPolls = (userId) =>
    JSON.parse(localStorage.getItem(`votedPolls_${userId}`)) || {};

  // Record the poll that the user has voted for in localStorage
  const recordVote = (pollId, userId) => {
    const votedPolls = getVotedPolls(userId);
    votedPolls[pollId] = true;
    localStorage.setItem(`votedPolls_${userId}`, JSON.stringify(votedPolls));
  };

  // Check if a user has already voted on a specific poll
  const hasVoted = (pollId, userId) => {
    const votedPolls = getVotedPolls(userId);
    return !!votedPolls[pollId]; // Return true if the user has voted for this poll
  };

  // Function to handle voting for a poll option
  const voteForOption = async (pollId, optionId) => {
    const authStore = useAuthStore();
    const loggedInUser =
      authStore.user.value || JSON.parse(localStorage.getItem("userData"));
    const userId = loggedInUser ? loggedInUser.id : null;

    if (hasVoted(pollId, userId)) {
      throw new Error("You have already voted on this poll.");
    }

    try {
      await apiClient.post("/vote/count", { pollId, optionId });
      recordVote(pollId, userId);
      return "Vote created successfully";
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to cast vote.");
    }
  };

  // delete poll api call
  const deletePoll = async (pollId) => {
    try {
      const pollIndex = polls.value.findIndex((poll) => poll.id === pollId);
      if (pollIndex !== -1) {
        polls.value.splice(pollIndex, 1); // Remove the poll at the found index
      }
      await apiClient.delete(`/poll/${pollId}`);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete poll.");
    }
  };

  return {
    polls,
    loading,
    error,
    fetchPolls,
    voteForOption,
    hasVoted,
    deletePoll,
    hasMorePolls,
    resetPolls,
  };
});

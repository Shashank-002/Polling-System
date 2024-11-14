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

  // Fetch poll list from the API with pagination and a limit of 10
  const fetchPolls = async () => {
    const authStore = useAuthStore(); // Access auth store
    const loggedInUser =
      authStore.user.value || JSON.parse(localStorage.getItem("userData"));

    if (!loggedInUser) {
      error.value = "User not logged in.";
      return;
    }

    const userId = loggedInUser.id;
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get(`/poll/list/${page.value}?limit=10`);
      const fetchedPolls = response.data.rows.map((poll) => ({
        id: poll.id,
        title: poll.title,
        options: poll.optionList || [], // Ensure options are stored properly
      }));

      if (fetchedPolls.length < 10) {
        hasMorePolls.value = false; // No more polls if fetched less than limit
      }

      // Update local polls
      polls.value = [
        ...polls.value,
        ...fetchedPolls.filter((poll) => {
          const votedPolls = getVotedPolls(userId); // Retrieve voted polls for the current user
          return !votedPolls[poll.id]; // Show only fresh polls if not voted
        }),
      ];

      page.value += 1; // Increment page for next load
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to fetch polls.";
      console.error("Error fetching polls:", error.value);
    } finally {
      loading.value = false;
    }
  };

  // Initialize polls from localStorage if they exist
  const storedPolls = localStorage.getItem("polls");
  if (storedPolls) {
    polls.value = JSON.parse(storedPolls);
  }

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
      polls.value = polls.value.filter((poll) => poll.id !== pollId);
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
  };
});

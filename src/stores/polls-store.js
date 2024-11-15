import { defineStore } from "pinia";
import { ref } from "vue";
import { apiClient } from "../composables/use-api-call";
import { useAuthStore } from "./auth-store"; // Import auth store
import { ADMIN_ROLE_ID } from "../composables/constants";

export const usePollsStore = defineStore("polls", () => {
  const polls = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const hasMorePolls = ref(true);
  const page = ref(1); // Track the current page for pagination

  const fetchPolls = async () => {
    loading.value = true;
    error.value = null;

    try {
      const authStore = useAuthStore();
      const loggedInUser =
        authStore.user.value || JSON.parse(localStorage.getItem("userData"));
      const userId = loggedInUser ? loggedInUser.id : null;
      const isAdmin = loggedInUser?.roleId === ADMIN_ROLE_ID;

      let fetchedPolls = [];
      while (fetchedPolls.length < 10 && hasMorePolls.value) {
        const response = await apiClient.get(
          `/poll/list/${page.value}?limit=10`
        );
        const pollsFromServer = response.data.rows.map((poll) => ({
          id: poll.id,
          title: poll.title,
          options: poll.optionList || [],
        }));

        fetchedPolls.push(
          ...pollsFromServer.filter((poll) => {
            const votedPolls = getVotedPolls(userId);
            return isAdmin || !votedPolls[poll.id]; // Admin sees all; user sees non-voted
          })
        );

        if (pollsFromServer.length < 10) {
          hasMorePolls.value = false;
          break;
        }

        page.value += 1;
      }

      const fetchedPollIds = new Set();
      polls.value.push(
        ...fetchedPolls.filter(
          (poll) => !fetchedPollIds.has(poll.id) && fetchedPollIds.add(poll.id)
        )
      ); // for unique poll and save from duplicate.
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to fetch polls.";
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
      // polls.value = polls.value.filter((poll) => poll.id !== pollId);
      const pollIndex = polls.value.findIndex((poll) => poll.id === pollId);
      if (pollIndex !== -1) {
        polls.value.splice(pollIndex, 1); // Remove the poll at the found index
      }
      await apiClient.delete(`/poll/${pollId}`);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete poll.");
    }
  };

  const resetPolls = () => {
    polls.value = [];
    page.value = 1;
    hasMorePolls.value = true;
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

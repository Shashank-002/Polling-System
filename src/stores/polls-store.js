import { defineStore } from "pinia";
import { ref } from "vue";
import { apiClient } from "../composables/use-api-call";

export const usePollsStore = defineStore("polls", () => {
  const polls = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch poll list from the API with a limit of 10
  const fetchPolls = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get("/poll/list/1?limit=10");
      console.log("response", response);

      // Store the polls data in localStorage (including options)
      const storedPolls = response.data.rows.map((poll) => ({
        id: poll.id,
        title: poll.title,
        options: poll.optionList || [], // Ensure options are stored properly
      }));
      localStorage.setItem("polls", JSON.stringify(storedPolls));

      // Set the polls data to state
      polls.value = storedPolls;
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
  const getVotedPolls = () =>
    JSON.parse(localStorage.getItem("votedPolls")) || {};

  // Record the poll that the user has voted for in localStorage
  const recordVote = (pollId) => {
    const votedPolls = getVotedPolls();
    votedPolls[pollId] = true;
    localStorage.setItem("votedPolls", JSON.stringify(votedPolls));
  };

  // Check if a user has already voted on a specific poll
  const hasVoted = (pollId) => !!getVotedPolls()[pollId];

  // Function to handle voting for a poll option
  const voteForOption = async (pollId, optionId) => {
    if (hasVoted(pollId)) {
      throw new Error("You have already voted on this poll.");
    }

    try {
      await apiClient.post("/vote/count", { pollId, optionId });
      recordVote(pollId); // Mark this poll as voted for the user
      return "Vote created successfully";
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to cast vote.");
    }
  };

  return {
    polls,
    loading,
    error,
    fetchPolls,
    voteForOption,
    hasVoted,
  };
});

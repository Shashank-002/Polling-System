<template>
    <div>
        <canvas ref="barChartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, CategoryScale, BarElement, Title, Tooltip, Legend, BarController, LinearScale } from 'chart.js';

Chart.register(CategoryScale, BarElement, Title, Tooltip, Legend, BarController, LinearScale);

const props = defineProps({
    poll: Object,
    userId: Number,
});

const barChartCanvas = ref(null);
let chartInstance = null;

// Function to calculate vote counts from localStorage
const getVoteCounts = (poll) => {
    const voteCounts = {};

    // Initialize vote counts for each option
    poll.options.forEach(option => {
        voteCounts[option.id] = 0;
    });

    // Retrieve all users' votes from localStorage
    for (const key in localStorage) {
        if (key.startsWith("votedOptions_")) {
            const userVotes = JSON.parse(localStorage.getItem(key));

            // Check if the user has voted on the current poll
            if (userVotes && userVotes[poll.id]) {
                const optionId = userVotes[poll.id];
                if (voteCounts[optionId] !== undefined) {
                    voteCounts[optionId]++;
                }
            }
        }
    }

    return voteCounts;
};

// Function to render the chart
const renderChart = () => {
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Fetch poll options and their vote counts
    const pollOptions = props.poll.options.map(option => option.optionTitle);
    const voteCounts = getVoteCounts(props.poll);
    const pollVotes = props.poll.options.map(option => voteCounts[option.id] || 0);

    chartInstance = new Chart(barChartCanvas.value, {
        type: 'bar',
        data: {
            labels: pollOptions,
            datasets: [
                {
                    label: 'Votes',
                    data: pollVotes,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};

// Watch the poll prop and re-render chart when it updates
watch(() => props.poll, renderChart);

// Initial chart rendering on component mount
onMounted(renderChart);
</script>

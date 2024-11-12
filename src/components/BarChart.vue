<template>
    <div>
        <canvas ref="barChartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, CategoryScale, BarElement, Title, Tooltip, Legend, BarController, LinearScale } from 'chart.js';

// Register necessary components
Chart.register(CategoryScale, BarElement, Title, Tooltip, Legend, BarController, LinearScale);

const props = defineProps({
    poll: Object,
});

const barChartCanvas = ref(null);

let chartInstance = null;

onMounted(() => {
    renderChart();
});

watch(() => props.poll, () => {
    renderChart();
});

const renderChart = () => {
    if (chartInstance) {
        chartInstance.destroy(); // Destroy existing chart instance if any
    }

    const pollOptions = props.poll.options.map(option => option.optionTitle);
    const pollVotes = props.poll.options.map(option => option.voteCount);

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
                    type: 'category',
                    beginAtZero: true,
                },
                y: {
                    type: 'linear',
                },
            },
        },
    });
};
</script>
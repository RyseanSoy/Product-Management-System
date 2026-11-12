"use client";

// Chart.js draws the chart in the browser.
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, Tooltip, Legend,
} from "chart.js";

// Register the Chart.js features used by this bar chart.
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = { data: { brand: string; count: number }[] };

export default function BrandBarChart({ data }: Props) {
    // Convert the shared brand data into Chart.js format.
    const chartData = {
        labels: data.map((d) => d.brand),
        datasets: [{
            label: "Laptops in stock",
            data: data.map((d) => d.count),
            backgroundColor: "#3b82f6",
        }],
    };
    // Render the bar chart with the prepared labels and values.
    return <Bar data={chartData} />;
}

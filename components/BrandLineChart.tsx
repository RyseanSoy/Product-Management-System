"use client";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type Props = { data: { brand: string; count: number }[] };

export default function BrandLineChart({ data }: Props) {
    const chartData = {
        labels: data.map((d) => d.brand),
        datasets: [{
            label: "Laptops in stock",
            data: data.map((d) => d.count),
            borderColor: "#ef4444",
        }],
    };
    return <Line data={chartData} />;
}
"use client";

// MUI charts render as interactive React components in the browser.
import { LineChart } from "@mui/x-charts/LineChart";

type Props = { data: { brand: string; count: number }[] };

export default function BrandLineChart({ data }: Props) {
    // Use brands as x-axis labels and stock totals as line values.
    return (
        <LineChart
            xAxis={[{
                scaleType: "point",
                data: data.map((d) => d.brand),
                label: "Brand",
            }]}
            yAxis={[{ label: "Laptops in stock" }]}
            series={[{
                data: data.map((d) => d.count),
                label: "Stock quantity",
            }]}
            width={500}
            height={300}
        />
    );
}

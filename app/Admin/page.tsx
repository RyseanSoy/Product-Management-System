"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";
import BrandBarChart from "@/components/BrandBarChart";
import BrandLineChart from "@/components/BrandLineChart";

type Product = {
    brand: string;
    quantity_Stock: number;
};

type BrandData = {
    brand: string;
    count: number;
};

export default function AdminDashboard() {
    const router = useRouter();
  // Chart data is grouped by product brand.
    const [data, setData] = useState<BrandData[]>([]);

    useEffect(() => {
        async function loadDashboard() {
      // Only logged-in Admin users can view the dashboard.
            if (!pb.authStore.isValid || pb.authStore.record?.role !== "Admin") {
                router.push("/login");
                return;
            }

            const response = await fetch("/api/getAllProducts");
            if (!response.ok) return;

            const products: Product[] = await response.json();
      // Add the stock quantity for products with the same brand.
            const totals = products.reduce<Record<string, number>>((result, product) => {
                result[product.brand] = (result[product.brand] ?? 0) + Number(product.quantity_Stock || 0);
                return result;
            }, {});

            setData(Object.entries(totals).map(([brand, count]) => ({ brand, count })));
        }

        void loadDashboard();
    }, [router]);

    return (
        <section className="page">
            <h1>Admin Dashboard</h1>
            <div className="chartGrid">
                <div className="card"><BrandBarChart data={data} /></div>
                <div className="card"><BrandLineChart data={data} /></div>
            </div>
        </section>
    );
}

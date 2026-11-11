
"use client";

import pb from "@/lib/pocketbase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"

type Product = {
    id: string;
    brand: string;
    model: string;
    description: string;
    quantity_Stock: number;
    price: number;
};

export default function Products() {
    // Load and display the products saved in PocketBase.
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);

    const getProducts = async () => {

        const res = await fetch("/api/getAllProducts");

        setProducts(await res.json());

    };


    useEffect(() => {
        if (!pb.authStore.isValid) {
            router.push("/login");
            return;
        }

        void getProducts();

    }, [router]);


    const deleteProduct = async (id: string) => {

        await fetch(`/api/deleteProduct?id=${id}`, {

            method: "DELETE",

        });


        getProducts();

    };

    return (

        <section className="page">

            <h1>Products</h1>

            <div className="card">

                <h2>Products List</h2>

                <div className="tableWrapper">
                    <table className="productsTable">
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <Link href={`/productViewer/${product.id}`}>
                                            {product.id}
                                        </Link>
                                    </td>
                                    <td>{product.brand}</td>
                                    <td>{product.model}</td>
                                    <td>{product.description}</td>
                                    <td>{product.quantity_Stock}</td>
                                    <td>{product.price}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

    );

}

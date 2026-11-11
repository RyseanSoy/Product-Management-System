"use client";

import pb from "@/lib/pocketbase";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Product = {
    id: string;
    brand: string;
    model: string;
    description: string;
    quantity_Stock: number;
    price: number;
};
// Edit products page
export default function EditProductsPage() {
    // Load products and allow their details to be edited.
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [message, setMessage] = useState("");

    // check user
    useEffect(() => {
        if (!pb.authStore.isValid) {
            router.push("/login");
            return;
        }
        //get products
        void getProducts();
    }, [router]);

    // get all products
    async function getProducts() {
        const response = await fetch("/api/getAllProducts");
        if (response.ok) setProducts(await response.json());
    }
    // change product
    function changeProduct(
        id: string,
        field: keyof Omit<Product, "id">,
        event: ChangeEvent<HTMLInputElement>
    ) {
        const value = event.target.value;
        setProducts((current) => current.map((product) => product.id === id
            ? { ...product, [field]: field === "price" || field === "quantity_Stock" ? Number(value) : value }
            : product
        ));
    }
    // Update product
    async function updateProduct(product: Product) {
        const response = await fetch(`/api/updateProducts?id=${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });

        setMessage(response.ok ? "Product updated" : "Could not update product");
        if (response.ok) await getProducts();
    }
    // Delete product
    async function deleteProduct(id: string) {
        await fetch(`/api/deleteProduct?id=${id}`, { method: "DELETE" });
        await getProducts();
    }

    return (
        <section className="page">
            <h1>Edit Products</h1>
            <div className="card">
                <h2>Products List</h2>
                {message && <p className="formSuccess">{message}</p>}
                <div className="tableWrapper">
                    <table className="productsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Actions</th>
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
                                    <td><input className="editInput" value={product.brand} onChange={(event) => changeProduct(product.id, "brand", event)} /></td>
                                    <td><input className="editInput" value={product.model} onChange={(event) => changeProduct(product.id, "model", event)} /></td>
                                    <td><input className="editInput" value={product.description} onChange={(event) => changeProduct(product.id, "description", event)} /></td>
                                    <td><input className="editInput" type="number" value={product.quantity_Stock} onChange={(event) => changeProduct(product.id, "quantity_Stock", event)} /></td>
                                    <td><input className="editInput" type="number" value={product.price} onChange={(event) => changeProduct(product.id, "price", event)} /></td>
                                    <td className="tableActions">
                                        <button onClick={() => updateProduct(product)}>Update</button>
                                        <button onClick={() => deleteProduct(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

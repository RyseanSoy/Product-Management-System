"use client";

import pb from "@/lib/pocketbase";
import { FormEvent, useEffect, useState } from "react";
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

export default function AddProductPage() {
    // Store the new product form values.
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [description, setDescription] = useState("");
    const [quantityStock, setQuantityStock] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // Check if user is logged in and get all products
    useEffect(() => {
        if (!pb.authStore.isValid) {
            router.push("/login");
            return;
        }

        void getProducts();
    }, [router]);
    // Get all products by calling the api
    async function getProducts() {
        const response = await fetch("/api/getAllProducts");
        if (response.ok) {
            setProducts(await response.json());
        }
    }

    async function addProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");
        // Add product by calling the api
        try {
            const response = await fetch("/api/addProduct", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    brand,
                    model,
                    description,
                    quantityStock: Number(quantityStock),
                    price: Number(price),
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Failed to add product");
            }
            // Clear form and set success message
            setBrand("");
            setModel("");
            setDescription("");
            setQuantityStock("");
            setPrice("");
            setSuccess("Product added successfully");
            await getProducts(); // Refresh the product list
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Failed to add product");
        }
    }

    return (
        <section className="page">
            <h1>Add Product</h1>
            {/* Add Product Form */}
            <div className="card">
                <form className="addProductForm" onSubmit={addProduct}>
                    <div className="formField">
                        <label htmlFor="brand">Brand</label>
                        <input id="brand" value={brand} onChange={(event) => setBrand(event.target.value)} required />
                    </div>
                    <div className="formField">
                        <label htmlFor="model">Model</label>
                        <input id="model" value={model} onChange={(event) => setModel(event.target.value)} required />
                    </div>
                    <div className="formField formFieldWide">
                        <label htmlFor="description">Description</label>
                        <input id="description" value={description} onChange={(event) => setDescription(event.target.value)} required />
                    </div>
                    <div className="formField">
                        <label htmlFor="quantityStock">Quantity</label>
                        <input id="quantityStock" type="number" min="0" value={quantityStock} onChange={(event) => setQuantityStock(event.target.value)} required />
                    </div>
                    <div className="formField">
                        <label htmlFor="price">Price</label>
                        <input id="price" type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} required />
                    </div>
                    <button className="formSubmit" type="submit">Add Product</button>
                </form>
                {success && <p className="formSuccess">{success}</p>}
                {error && <p className="formError">{error}</p>}
            </div>
            {/* Product List */}
            <h2 className="sectionHeading">Products List</h2>
            <div className="card">
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
}// end of function

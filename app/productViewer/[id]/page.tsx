"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

type Product = {
    brand: string
    model: string
    description: string
    quantity_Stock: number
    price: number
}

export default function ProductViewerPage() {
    const { id } = useParams<{ id: string }>()
    const [product, setProduct] = useState<Product | null>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadProduct() {
            try {
                const res = await fetch(`/api/getSingleProduct?id=${id}`)
                if (!res.ok) throw new Error("Product not found")
                setProduct(await res.json())
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load product")
            }
        }
        loadProduct()
    }, [id])

    if (error) return <section className="page"><p className="formError">{error}</p></section>
    if (!product) return <section className="page"><p>Loading...</p></section>

    return (
        <section className="page">
            <div className="productViewer">
                <div className="productViewerHeader">
                    <p className="eyebrow">Product details</p>
                    <h1>{product.brand}</h1>
                    <h2>{product.model}</h2>
                </div>
                <div className="productDetails">
                    <div><span>Price</span><strong>{product.price}</strong></div>
                    <div><span>Quantity</span><strong>{product.quantity_Stock}</strong></div>
                    <div className="productDescription"><span>Description</span><strong>{product.description}</strong></div>
                </div>
            </div>
        </section>
    )
}

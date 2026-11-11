import { NextRequest, NextResponse } from "next/server";
import { db, authenticate } from "@/lib/database";

export async function PUT(request: NextRequest) {
    try {
        await authenticate(); // authenticate user

        const id = new URL(request.url).searchParams.get("id"); // get id 
        const body = await request.json();// get body from request

        if (!id) {
            return NextResponse.json({ error: "Product id is required" }, { status: 400 });
        }
        // update product
        const product = await db.collection("products").update(id, {
            brand: body.brand,
            model: body.model,
            description: body.description,
            quantity_Stock: Number(body.quantity_Stock),
            price: Number(body.price),
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Failed to update product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

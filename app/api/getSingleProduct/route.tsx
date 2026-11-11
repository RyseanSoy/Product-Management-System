import { NextRequest, NextResponse } from "next/server";
import { db, authenticate } from "@/lib/database";

export async function GET(request: NextRequest) {
    try {
        await authenticate();
        const id = request.nextUrl.searchParams.get("id");
        if (id) {
            const record = await db.collection("products").getOne(id);
            return NextResponse.json(record);
        } else {
            return NextResponse.json({ error: "No ID provided" }, { status: 400 });
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Product not found";
        return NextResponse.json({ error: message }, { status: 404 });
    }
}

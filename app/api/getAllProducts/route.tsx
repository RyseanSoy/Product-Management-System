
import { NextResponse } from "next/server";
import { db, authenticate } from "@/lib/database";

export async function GET() {

  try {
    await authenticate();
    // Fetch all products from PocketBase
    const products = await db.collection("products").getFullList({
      sort: "-created",
    });
    // Return products as JSON
    return NextResponse.json(products, { status: 200 });

  } catch (error) {

    console.error("Failed to fetch products:", error);

    return NextResponse.json(

      { error: "Failed to fetch products" },
      { status: 500 }

    );// return error

  }// catch error

} // API Endpoint to fetch all products from PocketBase


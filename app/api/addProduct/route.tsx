
import { NextRequest, NextResponse } from "next/server";
import { db, authenticate } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    // Verify that the user is authenticated
    await authenticate();
    // Get the product details from the request body
    const { brand, model, description, quantityStock, price } = await request.json();
    // if the details are empty, show an error message
    if (!brand || !model || !description || quantityStock === undefined || price === undefined) {
      return NextResponse.json(
        { error: "Name, description and price are required" },
        { status: 400 }
      );
    }

    // Create the product in the database
    const product = await db.collection("products").create({
      brand,
      model,
      description,
      quantity_Stock: quantityStock,
      price,
    });




    // send the OK back to the client with the created product
    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

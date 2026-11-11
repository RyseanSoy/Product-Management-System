import { NextResponse } from "next/server";
import { createClient } from "redis";

export async function GET() {
  const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });

  client.on("error", (error) => console.error("Redis client error", error));

  try {
    await client.connect();
    await client.set("hello", "Hello from Redis!");
    const result = await client.get("hello");

    return NextResponse.json({ message: "Hello from Next.js API..." + result });
  } finally {
    if (client.isOpen) await client.quit();
  }
}

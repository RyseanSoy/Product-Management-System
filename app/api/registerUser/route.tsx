import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { readFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
        );
    }

    if (password.length < 8) {
        return NextResponse.json(
            { error: "Password must be at least 8 characters" },
            { status: 400 }
        );
    }
    const buffer = await readFile(path.join(process.cwd(), "public", "defaultProfile.jpg"));
    const defaultAvatar = new File([buffer], "defaultProfile.jpg", { type: "image/jpeg" });
    const normalizedEmail = email.trim().toLowerCase();
    const pb = new PocketBase(process.env.POCKETBASE_URL);
    try {
        const user = await pb.collection("users").create({
            name,
            email: normalizedEmail,
            password,
            avatar: defaultAvatar,
            role: "User",
            passwordConfirm: password,
        });

        return NextResponse.json(
            { id: user.id, email: user.email },
            { status: 201 }
        );
    } catch (error: unknown) {
        const pocketbaseError = error as {
            response?: {
                message?: string;
                data?: Record<string, { message?: string }>;
            };
        };
        const fieldError = Object.values(pocketbaseError.response?.data ?? {})[0]?.message;
        return NextResponse.json(
            { error: fieldError ?? pocketbaseError.response?.message ?? "Unable to create account" },
            { status: 400 }
        );
    }
}

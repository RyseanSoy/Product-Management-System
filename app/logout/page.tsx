'use client'

import { useState } from "react";
import pb from "@/lib/pocketbase";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  // Clear the PocketBase login session and return to the login page.
  const router = useRouter();

  async function logout() {
    pb.authStore.clear();
    router.push("/login");
  }

  return <button onClick={logout}>Log out</button>;
}

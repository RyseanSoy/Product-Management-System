"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";


export default function Profile() {
  // Display the currently logged-in user's profile information.
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  // Load the user profile. and authenticate
  useEffect(() => {
    async function loadProfile() {
      if (!pb.authStore.isValid) {
        router.push("/login");
        return;
      }
      // Try to refresh the auth token and get the user profile.
      try {
        await pb.collection("users").authRefresh();
      } catch {
        // Keep the current auth record if refresh is cancelled or unavailable.
      } finally {
        setUser(pb.authStore.record);
      }
    }

    void loadProfile();
  }, [router]);

  if (!user) return null;

  const avatarUrl = user.avatar
    ? pb.files.getURL(user, user.avatar)
    : "/defaultProfile.jpg";

  return (
    <section className="page">
      <h1>Profile</h1>
      <div className="profileHero">
        <Image className="profileAvatar" src={avatarUrl} width={130} height={130} unoptimized alt={`${user.name}'s profile avatar`} />
        <div className="profileText">
          <h2>{user.name}</h2>
          <p className="profileWelcome">Your account details</p>
          <div className="profileDetails">
            <div><span>Email</span><strong>{user.email}</strong></div>
            <div><span>Role</span><strong>{user.role || "User"}</strong></div>
            <div><span>User ID</span><strong>{user.id}</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}

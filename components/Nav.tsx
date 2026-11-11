"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";

export default function Nav() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/defaultProfile.jpg");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(pb.authStore.isValid);
      setUserName(pb.authStore.record?.name ?? "");
      const record = pb.authStore.record;
      setAvatarUrl(record?.avatar ? pb.files.getURL(record, record.avatar) : "/defaultProfile.jpg");
      setUserRole(record?.role ?? "");
    };
    updateAuth();
    return pb.authStore.onChange(updateAuth);
  }, []);

  function logout() {
    pb.authStore.clear();
    router.push("/");
  }

  return (
    <nav className="topNav">
      <Link href="/">Home</Link>

      {isLoggedIn ? (
        <>
          <Link href="/products">Products</Link>
          <Link href="/add">Add Product</Link>
          <Link href="/Edit">Edit Product</Link>
          <Link href="/profile">My Profile</Link>
          {userRole === "Admin" && <Link href="/Admin">Admin</Link>}
          <span className="navUser">
            <Image className="navAvatar" src={avatarUrl} width={32} height={32} unoptimized alt="Profile avatar" />
            {userName || "Account"}
          </span>
          <button className="navButton" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

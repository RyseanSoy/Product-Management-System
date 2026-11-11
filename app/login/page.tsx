"use client";

import { useState } from "react";
import pb from "@/lib/pocketbase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // Store the user's login form values.
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(event: React.FormEvent) {
    event.preventDefault();

    try {
      await pb.collection("users").authWithPassword(email.trim().toLowerCase(), password);
      router.push("/products");
    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <form className="authForm" onSubmit={login}>
      <h1>Login</h1>
      <input
        className="authInput"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="authInput"
        type="password"
        minLength={8}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />


      <button className="authButton" type="submit">Log in</button>

      <p className="authSwitch">
        Don&apos;t have an account? <a href="/register">Sign up</a>
      </p>

      {error && <p className="authError">{error}</p>}
    </form>
  );
}

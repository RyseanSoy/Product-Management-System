"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"


export default function RegisterPage() {
    // Store the values entered in the registration form.
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    async function register() {
        setError("");

        try {
            const response = await fetch("/api/registerUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            })

            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.error || "Registration failed")
            }

            router.push("/login")
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to register")
        }
    }

    return (
        <form className="authForm" onSubmit={(event) => { event.preventDefault(); void register(); }}>
            <h1>Register</h1>
            <input
                className="authInput"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
                className="authInput"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
                className="authInput"
                type="password"
                minLength={8}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <input
                className="authInput"
                type="password"
                minLength={8}
                placeholder="ConfirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br />

            <button
                className="authButton"
                type="submit"
                onClick={(event) => {
                    event.preventDefault();
                    void register();
                }}
            >
                Register
            </button>
            {error && <p className="authError">{error}</p>}
        </form>
    )
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { signInAdmin } from "../services/auth.service";

export function AdminLoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            await signInAdmin(email, password);

            router.push("/admin/dashboard");
            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unable to login.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 shadow-sm"
        >
            <div className="mb-8">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                    Kembang Petali
                </p>

                <h1 className="mt-3 text-3xl font-bold text-gray-900">
                    Admin Login
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Sign in to manage Kembang Petali.
                </p>
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                />
            </div>

            <div className="mt-5">
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Password
                </label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                />
            </div>

            {error && (
                <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="mt-6">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading
                        ? "Signing in..."
                        : "Login"}
                </Button>
            </div>
        </form>
    );
}
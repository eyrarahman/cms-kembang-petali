"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signOutAdmin } from "../services/auth.service";

export function LogoutButton() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    async function handleLogout() {
        try {
            setIsLoading(true);

            await signOutAdmin();

            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="text-sm font-medium text-red-500 hover:text-red-600"
        >
            {isLoading ? "Logging out..." : "Logout"}
        </button>
    );
}
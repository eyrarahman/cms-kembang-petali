"use client";

import { useRouter } from "next/navigation";

export function ProductDetailBackButton() {
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-rose-500"
        >
            ← Back to Previous Page
        </button>
    );
}

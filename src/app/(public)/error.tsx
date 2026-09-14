"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PublicError({
    error,
    reset,
}: {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6">
            <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                    Something Went Wrong
                </p>

                <h1 className="mt-4 text-3xl font-bold text-gray-900">
                    We couldn&apos;t load this page.
                </h1>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                    There may be a temporary issue
                    loading the information. Please
                    try again.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-600"
                    >
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
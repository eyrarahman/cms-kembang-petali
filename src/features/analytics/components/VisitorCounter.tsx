"use client";

import {
    useEffect,
    useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

type VisitStats = {
    today_count: number;
    total_count: number;
};

function getMalaysiaDate() {
    const parts =
        new Intl.DateTimeFormat(
            "en-GB",
            {
                timeZone:
                    "Asia/Kuala_Lumpur",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }
        ).formatToParts(
            new Date()
        );

    const year =
        parts.find(
            (part) =>
                part.type === "year"
        )?.value;

    const month =
        parts.find(
            (part) =>
                part.type === "month"
        )?.value;

    const day =
        parts.find(
            (part) =>
                part.type === "day"
        )?.value;

    return `${year}-${month}-${day}`;
}

export function VisitorCounter() {
    const [
        stats,
        setStats,
    ] =
        useState<VisitStats | null>(
            null
        );

    useEffect(() => {
        async function loadStats() {
            const supabase =
                createClient();

            const today =
                getMalaysiaDate();

            const storageKey =
                `kembang-petali-visit-${today}`;

            const alreadyVisited =
                localStorage.getItem(
                    storageKey
                );

            const functionName =
                alreadyVisited
                    ? "get_website_visit_stats"
                    : "record_website_visit";

            const {
                data,
                error,
            } = await supabase.rpc(
                functionName
            );

            if (
                error ||
                !data ||
                data.length === 0
            ) {
                return;
            }

            if (!alreadyVisited) {
                localStorage.setItem(
                    storageKey,
                    "1"
                );
            }

            setStats(data[0]);
        }

        void loadStats();
    }, []);

    if (!stats) {
        return null;
    }

    return (
        <div className="mt-6 grid grid-cols-2 gap-3">
            {/* TODAY */}
            <div className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/60 px-3 py-4 text-center">

                <p className="mt-2 text-2xl font-bold text-gray-900">
                    {Number(
                        stats.today_count
                    ).toLocaleString("en-MY")}
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500">
                    Hari Ini
                </p>
            </div>

            {/* TOTAL */}
            <div className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/60 px-3 py-4 text-center">

                <p className="mt-2 text-2xl font-bold text-gray-900">
                    {Number(
                        stats.total_count
                    ).toLocaleString("en-MY")}
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500">
                    Jumlah Pelawat
                </p>
            </div>
        </div>
    );
}
"use client";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
    useEffect,
    useRef,
    useState,
} from "react";

import { getCapacityAvailability } from "@/features/capacity/services/capacity-availability.service";

import { CapacityAvailability } from "@/features/capacity/types/capacity-availability.types";
import {
    CapacityOverride,
    CapacitySettings,
} from "@/features/capacity/types/capacity.types";

import { CalendarEvent } from "../types/calendar.types";
import { CalendarMonthInfo } from "../utils/calendar.utils";

type AdminCalendarScreenProps = {
    events: CalendarEvent[];
    month: CalendarMonthInfo;

    capacitySettings: CapacitySettings;
    capacityOverrides: CapacityOverride[];

    todayDate: string;
};

const weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];

function getEventLabel(
    event: CalendarEvent
) {
    switch (event.type) {
        case "production":
            return "Production";

        case "delivery":
            return "Delivery";

        case "postage":
            return "Postage";

        case "pickup":
            return "Pickup";

        case "blocked":
            return "Blocked";
    }
}

function getEventStyle(
    event: CalendarEvent
): CSSProperties {
    switch (event.type) {
        case "production":
            return {
                backgroundColor: "#F3E8FF",
                borderColor: "#D8B4FE",
                color: "#581C87",
            };

        case "delivery":
            return {
                backgroundColor: "#DBEAFE",
                borderColor: "#93C5FD",
                color: "#1E3A8A",
            };

        case "postage":
            return {
                backgroundColor: "#FEF3C7",
                borderColor: "#FCD34D",
                color: "#92400E",
            };

        case "pickup":
            return {
                backgroundColor: "#DCFCE7",
                borderColor: "#86EFAC",
                color: "#166534",
            };

        case "blocked":
            return {
                backgroundColor: "#FEE2E2",
                borderColor: "#FCA5A5",
                color: "#991B1B",
            };
    }
}

function getDayNumber(
    date: string
) {
    return Number(
        date.split("-")[2]
    );
}

function formatFullDate(
    value: string
) {
    return new Intl.DateTimeFormat(
        "en-MY",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    ).format(
        new Date(
            `${value}T00:00:00`
        )
    );
}

function getDayCapacity(
    date: string,
    events: CalendarEvent[],
    settings: CapacitySettings,
    overrides: CapacityOverride[]
) {
    const override =
        overrides.find(
            (item) =>
                item.capacityDate === date
        );

    const fulfillmentEvents =
        events.filter(
            (event) =>
                event.type === "delivery" ||
                event.type === "postage" ||
                event.type === "pickup"
        );

    const bookedOrders =
        fulfillmentEvents.length;

    const isBlocked =
        override?.isBlocked ?? false;

    const capacity =
        isBlocked
            ? 0
            : override?.capacity ??
            settings.defaultDailyCapacity;

    const availableSlots =
        Math.max(
            capacity - bookedOrders,
            0
        );

    return {
        capacity,
        bookedOrders,
        availableSlots,
        isBlocked,

        isFull:
            !isBlocked &&
            bookedOrders >= capacity,
    };
}

export function AdminCalendarScreen({
    events,
    month,
    capacitySettings,
    capacityOverrides,
    todayDate,
}: AdminCalendarScreenProps) {

    const [
        selectedDate,
        setSelectedDate,
    ] = useState<string | null>(
        null
    );

    const [
        selectedCapacity,
        setSelectedCapacity,
    ] =
        useState<CapacityAvailability | null>(
            null
        );

    const [
        isLoadingCapacity,
        setIsLoadingCapacity,
    ] = useState(false);

    const [
        capacityError,
        setCapacityError,
    ] = useState("");

    const dailyOverviewRef =
        useRef<HTMLElement | null>(
            null
        );

    useEffect(() => {
        if (!selectedDate) {
            return;
        }

        dailyOverviewRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, [selectedDate]);

    const eventsByDate =
        events.reduce<
            Record<
                string,
                CalendarEvent[]
            >
        >(
            (
                result,
                event
            ) => {
                if (
                    !result[
                    event.date
                    ]
                ) {
                    result[
                        event.date
                    ] = [];
                }

                result[
                    event.date
                ].push(event);

                return result;
            },
            {}
        );

    async function handleDateClick(
        date: string
    ) {
        setSelectedDate(date);

        setSelectedCapacity(
            null
        );

        setCapacityError("");

        setIsLoadingCapacity(
            true
        );

        try {
            const availability =
                await getCapacityAvailability(
                    date
                );

            setSelectedCapacity(
                availability
            );
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setCapacityError(
                    error.message
                );
            } else {
                setCapacityError(
                    "Unable to load capacity."
                );
            }
        } finally {
            setIsLoadingCapacity(
                false
            );
        }
    }

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-7xl">

                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Order Planning
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Calendar
                    </h1>

                    <p className="mt-3 text-gray-600">
                        View production,
                        fulfilment and blocked
                        dates.
                    </p>
                </div>

                {/* MONTH NAVIGATION */}
                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-rose-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href={`/admin/calendar?month=${month.previousMonth}`}
                        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        ← Previous
                    </Link>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {
                                month.monthLabel
                            }
                        </h2>

                        <Link
                            href="/admin/calendar"
                            className="mt-1 inline-block text-sm font-medium text-rose-500 hover:text-rose-600"
                        >
                            Today
                        </Link>
                    </div>

                    <Link
                        href={`/admin/calendar?month=${month.nextMonth}`}
                        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Next →
                    </Link>
                </div>

                {/* LEGEND */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <LegendItem
                        label="Production"
                        type="production"
                    />

                    <LegendItem
                        label="Delivery"
                        type="delivery"
                    />

                    <LegendItem
                        label="Postage"
                        type="postage"
                    />

                    <LegendItem
                        label="Pickup"
                        type="pickup"
                    />

                    <LegendItem
                        label="Blocked"
                        type="blocked"
                    />
                </div>

                {/* CALENDAR */}
                <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">

                    <div className="min-w-[1000px]">
                        <div
                            className="grid border-b border-gray-200 bg-gray-50"
                            style={{
                                gridTemplateColumns:
                                    "repeat(7, minmax(0, 1fr))",
                            }}
                        >
                            {weekDays.map(
                                (
                                    day
                                ) => (
                                    <div
                                        key={
                                            day
                                        }
                                        className="px-3 py-4 text-center text-sm font-semibold text-gray-500"
                                    >
                                        {
                                            day
                                        }
                                    </div>
                                )
                            )}
                        </div>

                        <div
                            className="grid"
                            style={{
                                gridTemplateColumns:
                                    "repeat(7, minmax(0, 1fr))",
                            }}
                        >
                            {month.days.map(
                                (
                                    date
                                ) => {
                                    const [
                                        year,
                                        monthNumber,
                                    ] =
                                        date
                                            .split(
                                                "-"
                                            )
                                            .map(
                                                Number
                                            );

                                    const isCurrentMonth =
                                        year ===
                                        month.year &&
                                        monthNumber -
                                        1 ===
                                        month.monthIndex;

                                    const dayEvents =
                                        eventsByDate[
                                        date
                                        ] ??
                                        [];

                                    const dayCapacity =
                                        getDayCapacity(
                                            date,
                                            dayEvents,
                                            capacitySettings,
                                            capacityOverrides
                                        );

                                    const isToday =
                                        date === todayDate;

                                    return (
                                        <div
                                            key={date}
                                            className={`min-h-44 border-b border-r p-3 ${isToday
                                                ? "border-rose-200 bg-rose-50/40"
                                                : isCurrentMonth
                                                    ? "border-gray-100 bg-white"
                                                    : "border-gray-100 bg-gray-50"
                                                }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDateClick(
                                                        date
                                                    )
                                                }
                                                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition ${selectedDate === date
                                                    ? "bg-rose-500 text-white"
                                                    : isToday
                                                        ? "bg-rose-100 text-rose-600"
                                                        : isCurrentMonth
                                                            ? "text-gray-900 hover:bg-rose-50 hover:text-rose-500"
                                                            : "text-gray-400 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {getDayNumber(
                                                    date
                                                )}
                                            </button>

                                            {isCurrentMonth && (
                                                <div className="mt-2">
                                                    {dayCapacity.isBlocked ? (
                                                        <span
                                                            className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold"
                                                            style={{
                                                                backgroundColor:
                                                                    "#FEE2E2",
                                                                borderColor:
                                                                    "#FCA5A5",
                                                                color:
                                                                    "#991B1B",
                                                            }}
                                                        >
                                                            BLOCKED
                                                        </span>
                                                    ) : dayCapacity.isFull ? (
                                                        <span
                                                            className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold"
                                                            style={{
                                                                backgroundColor:
                                                                    "#FEF3C7",
                                                                borderColor:
                                                                    "#FCD34D",
                                                                color:
                                                                    "#92400E",
                                                            }}
                                                        >
                                                            {dayCapacity.bookedOrders}/
                                                            {dayCapacity.capacity} FULL
                                                        </span>
                                                    ) : dayCapacity.bookedOrders > 0 ? (
                                                        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                                            {dayCapacity.bookedOrders}/
                                                            {dayCapacity.capacity} booked
                                                        </span>
                                                    ) : null}
                                                </div>
                                            )}

                                            <div className="mt-3 space-y-2">
                                                {dayEvents.map(
                                                    (
                                                        event
                                                    ) => {
                                                        const content =
                                                            (
                                                                <>
                                                                    <p className="text-[11px] font-bold uppercase tracking-wide">
                                                                        {getEventLabel(
                                                                            event
                                                                        )}
                                                                    </p>

                                                                    <p className="mt-1 truncate text-sm font-bold">
                                                                        {event.title}
                                                                    </p>

                                                                    {event.customerName && (
                                                                        <p className="mt-1 truncate text-xs font-medium">
                                                                            {event.customerName}
                                                                        </p>
                                                                    )}

                                                                    {event.notes && (
                                                                        <p className="mt-1 line-clamp-2 text-xs">
                                                                            {event.notes}
                                                                        </p>
                                                                    )}
                                                                </>
                                                            );
                                                        const className =
                                                            "block rounded-lg border p-2.5 shadow-sm transition hover:shadow-md";

                                                        const eventStyle =
                                                            getEventStyle(event);

                                                        if (
                                                            event.orderId
                                                        ) {
                                                            return (
                                                                <Link
                                                                    key={
                                                                        event.id
                                                                    }
                                                                    href={`/admin/orders/${event.orderId}`}
                                                                    className={
                                                                        className
                                                                    }
                                                                    style={eventStyle}
                                                                >
                                                                    {
                                                                        content
                                                                    }
                                                                </Link>
                                                            );
                                                        }

                                                        return (
                                                            <div
                                                                key={
                                                                    event.id
                                                                }
                                                                className={
                                                                    className
                                                                }
                                                                style={eventStyle}
                                                            >
                                                                {
                                                                    content
                                                                }
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>

                {/* DAILY OVERVIEW */}
                {/* DAILY OVERVIEW */}
                {selectedDate && (
                    <section
                        ref={dailyOverviewRef}
                        className="mt-6 scroll-mt-6 rounded-2xl border border-rose-100 bg-white p-6"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">
                                    Daily Overview
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                    {formatFullDate(
                                        selectedDate
                                    )}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedDate(
                                        null
                                    );

                                    setSelectedCapacity(
                                        null
                                    );
                                }}
                                className="text-sm font-medium text-gray-400 hover:text-gray-600"
                            >
                                Close
                            </button>
                        </div>

                        {/* CAPACITY */}
                        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
                            <h3 className="font-semibold text-gray-900">
                                Capacity
                            </h3>

                            {isLoadingCapacity ? (
                                <p className="mt-3 text-sm text-gray-400">
                                    Loading capacity...
                                </p>
                            ) : capacityError ? (
                                <p className="mt-3 text-sm text-red-500">
                                    Unable to load capacity:{" "}
                                    {capacityError}
                                </p>
                            ) : selectedCapacity ? (
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <CapacityBox
                                        label="Capacity"
                                        value={
                                            selectedCapacity.isBlocked
                                                ? "Blocked"
                                                : String(
                                                    selectedCapacity.capacity
                                                )
                                        }
                                    />

                                    <CapacityBox
                                        label="Booked"
                                        value={String(
                                            selectedCapacity.bookedOrders
                                        )}
                                    />

                                    <CapacityBox
                                        label="Available"
                                        value={
                                            selectedCapacity.isBlocked
                                                ? "0"
                                                : String(
                                                    selectedCapacity.availableSlots
                                                )
                                        }
                                    />
                                </div>
                            ) : null}

                            {selectedCapacity?.isBlocked && (
                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    This date is blocked.
                                    {selectedCapacity.notes
                                        ? ` ${selectedCapacity.notes}`
                                        : ""}
                                </div>
                            )}

                            {selectedCapacity?.isFull &&
                                !selectedCapacity.isBlocked && (
                                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                                        This date is fully booked.
                                    </div>
                                )}
                        </div>

                        {/* DAILY EVENTS */}
                        <DailyEvents
                            events={
                                eventsByDate[
                                selectedDate
                                ] ?? []
                            }
                        />
                    </section>
                )}

            </div>
        </main>
    );
}

type LegendItemProps = {
    label: string;
    type: CalendarEvent["type"];
};

function LegendItem({
    label,
    type,
}: LegendItemProps) {
    return (
        <span
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={getEventStyle({
                id: "",
                date: "",
                title: "",
                type,
            })}
        >
            {label}
        </span>
    );
}

type CapacityBoxProps = {
    label: string;
    value: string;
};

function CapacityBox({
    label,
    value,
}: CapacityBoxProps) {
    return (
        <div className="rounded-xl bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <p className="mt-2 text-xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}

type DailyEventsProps = {
    events: CalendarEvent[];
};

function DailyEvents({
    events,
}: DailyEventsProps) {
    const productionEvents =
        events.filter(
            (event) =>
                event.type ===
                "production"
        );

    const fulfillmentEvents =
        events.filter(
            (event) =>
                event.type ===
                "delivery" ||
                event.type ===
                "postage" ||
                event.type ===
                "pickup"
        );

    const blockedEvents =
        events.filter(
            (event) =>
                event.type ===
                "blocked"
        );

    const deliveryEvents =
        events.filter(
            (event) =>
                event.type ===
                "delivery"
        );

    const postageEvents =
        events.filter(
            (event) =>
                event.type ===
                "postage"
        );

    const pickupEvents =
        events.filter(
            (event) =>
                event.type ===
                "pickup"
        );

    if (events.length === 0) {
        return (
            <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <p className="text-sm font-medium text-gray-500">
                    No activities for
                    this date.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-6">
            {/* DAILY BREAKDOWN */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <DailyCountBox
                    label="Production"
                    value={
                        productionEvents.length
                    }
                />

                <DailyCountBox
                    label="Delivery"
                    value={
                        deliveryEvents.length
                    }
                />

                <DailyCountBox
                    label="Postage"
                    value={
                        postageEvents.length
                    }
                />

                <DailyCountBox
                    label="Pickup"
                    value={
                        pickupEvents.length
                    }
                />
            </div>

            {/* EVENTS */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DailyEventSection
                    title="Production"
                    events={
                        productionEvents
                    }
                />

                <DailyEventSection
                    title="Fulfilment"
                    events={
                        fulfillmentEvents
                    }
                />

                {blockedEvents.length >
                    0 && (
                        <DailyEventSection
                            title="Blocked"
                            events={
                                blockedEvents
                            }
                        />
                    )}
            </div>
        </div>
    );
}

type DailyEventSectionProps = {
    title: string;
    events: CalendarEvent[];
};

function DailyEventSection({
    title,
    events,
}: DailyEventSectionProps) {
    return (
        <div className="rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                    {title}
                </h3>

                <span className="text-sm text-gray-400">
                    {events.length}
                </span>
            </div>

            {events.length === 0 ? (
                <p className="mt-4 text-sm text-gray-400">
                    No {title.toLowerCase()} activities.
                </p>
            ) : (
                <div className="mt-4 space-y-3">
                    {events.map(
                        (event) => (
                            <div
                                key={
                                    event.id
                                }
                                className="rounded-xl border p-4"
                                style={getEventStyle(event)}
                            >
                                <p className="text-xs font-bold uppercase">
                                    {getEventLabel(
                                        event
                                    )}
                                </p>

                                <p className="mt-1 font-semibold">
                                    {
                                        event.title
                                    }
                                </p>

                                {event.customerName && (
                                    <p className="mt-1 text-sm">
                                        {
                                            event.customerName
                                        }
                                    </p>
                                )}

                                {event.notes && (
                                    <p className="mt-2 text-sm">
                                        {
                                            event.notes
                                        }
                                    </p>
                                )}

                                {event.orderId && (
                                    <Link
                                        href={`/admin/orders/${event.orderId}`}
                                        className="mt-3 inline-block text-xs font-bold underline"
                                    >
                                        View Order →
                                    </Link>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

type DailyCountBoxProps = {
    label: string;
    value: number;
};

function DailyCountBox({
    label,
    value,
}: DailyCountBoxProps) {
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}
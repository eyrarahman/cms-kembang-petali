import Link from "next/link";

import { DashboardData } from "../types/dashboard.types";

type AdminDashboardScreenProps = {
    data: DashboardData;
    businessName: string;
};

function formatDate(
    value: string
) {
    return new Intl.DateTimeFormat(
        "en-MY",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(
        new Date(
            `${value}T00:00:00`
        )
    );
}

function formatLongDate(
    value: string
) {
    return new Intl.DateTimeFormat(
        "en-MY",
        {
            weekday: "long",
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

function formatMoney(
    value: number
) {
    return new Intl.NumberFormat(
        "en-MY",
        {
            style: "currency",
            currency: "MYR",
        }
    ).format(value);
}

function formatLabel(
    value: string
) {
    return value
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}

export function AdminDashboardScreen({
    data,
    businessName,
}: AdminDashboardScreenProps) {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-7xl">
                {/* HEADER */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            {businessName}
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900">
                            Dashboard
                        </h1>

                        <p className="mt-3 text-gray-600">
                            {formatLongDate(
                                data.date
                            )}
                        </p>
                    </div>

                    <Link
                        href="/admin/orders/new"
                        className="shrink-0 rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600"
                    >
                        + Add Order
                    </Link>
                </div>

                {(data.overdueFulfillments > 0 ||
                    data.overduePayments > 0) && (
                        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="font-bold text-red-900">
                                        Attention Required
                                    </p>

                                    <div className="mt-2 space-y-1 text-sm text-red-700">
                                        {data.overdueFulfillments >
                                            0 && (
                                                <p>
                                                    {
                                                        data.overdueFulfillments
                                                    }{" "}
                                                    overdue fulfilment
                                                    {data.overdueFulfillments >
                                                        1
                                                        ? "s"
                                                        : ""}
                                                </p>
                                            )}

                                        {data.overduePayments >
                                            0 && (
                                                <p>
                                                    {
                                                        data.overduePayments
                                                    }{" "}
                                                    overdue payment
                                                    {data.overduePayments >
                                                        1
                                                        ? "s"
                                                        : ""}
                                                </p>
                                            )}
                                    </div>
                                </div>

                                <Link
                                    href="/admin/orders"
                                    className="text-sm font-semibold text-red-700 hover:text-red-900"
                                >
                                    Review Orders →
                                </Link>
                            </div>
                        </div>
                    )}

                {/* SUMMARY */}
                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                    <SummaryCard
                        label="Pending Orders"
                        value={String(
                            data.pendingOrders
                        )}
                        href="/admin/orders?status=pending"
                    />

                    <SummaryCard
                        label="Today's Production"
                        value={String(
                            data.todayProductionCount
                        )}
                        href="/admin/calendar"
                    />

                    <SummaryCard
                        label="Today's Fulfilment"
                        value={String(
                            data.todayFulfillmentCount
                        )}
                        href="/admin/calendar"
                    />

                    <SummaryCard
                        label="Today's Fulfilment Value"
                        value={formatMoney(
                            data.todayFulfillmentValue
                        )}
                        href="/admin/orders"
                    />

                    <SummaryCard
                        label="Outstanding Payment"
                        value={formatMoney(
                            data.outstandingPayment
                        )}
                        href="/admin/orders?payment=partial"
                    />
                </div>

                <section className="mt-6">
                    <p className="text-sm font-semibold text-gray-700">
                        Quick Actions
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3">
                        <QuickAction
                            href="/admin/orders/new"
                            label="+ New Order"
                        />

                        <QuickAction
                            href="/admin/products"
                            label="Products"
                        />

                        <QuickAction
                            href="/admin/calendar"
                            label="Calendar"
                        />

                        <QuickAction
                            href="/admin/capacity"
                            label="Capacity"
                        />

                        <QuickAction
                            href="/admin/customers"
                            label="Customers"
                        />
                    </div>
                </section>

                {/* CAPACITY */}
                <section className="mt-6 rounded-2xl border border-rose-100 bg-white p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-rose-500">
                                Today&apos;s Capacity
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-gray-900">
                                Production Capacity
                            </h2>
                        </div>

                        <Link
                            href="/admin/capacity"
                            className="text-sm font-medium text-rose-500 hover:text-rose-600"
                        >
                            Manage Capacity →
                        </Link>
                    </div>

                    {data.todayCapacity.isBlocked ? (
                        <div
                            className="mt-6 rounded-xl border p-5"
                            style={{
                                backgroundColor:
                                    "#FEE2E2",
                                borderColor:
                                    "#FCA5A5",
                                color:
                                    "#991B1B",
                            }}
                        >
                            <p className="font-bold">
                                Today is blocked
                            </p>

                            {data.todayCapacity
                                .notes && (
                                    <p className="mt-2 text-sm">
                                        {
                                            data
                                                .todayCapacity
                                                .notes
                                        }
                                    </p>
                                )}
                        </div>
                    ) : (
                        <>
                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <DashboardMetric
                                    label="Capacity"
                                    value={String(
                                        data
                                            .todayCapacity
                                            .capacity
                                    )}
                                />

                                <DashboardMetric
                                    label="Booked"
                                    value={String(
                                        data
                                            .todayCapacity
                                            .bookedOrders
                                    )}
                                />

                                <DashboardMetric
                                    label="Available"
                                    value={String(
                                        data
                                            .todayCapacity
                                            .availableSlots
                                    )}
                                />
                            </div>

                            <div className="mt-5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        {
                                            data
                                                .todayCapacity
                                                .bookedOrders
                                        }
                                        /
                                        {
                                            data
                                                .todayCapacity
                                                .capacity
                                        }{" "}
                                        orders booked
                                    </span>

                                    {data
                                        .todayCapacity
                                        .isFull && (
                                            <span className="font-semibold text-amber-600">
                                                Fully Booked
                                            </span>
                                        )}
                                </div>

                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-rose-400"
                                        style={{
                                            width: `${data
                                                .todayCapacity
                                                .capacity >
                                                0
                                                ? Math.min(
                                                    (data
                                                        .todayCapacity
                                                        .bookedOrders /
                                                        data
                                                            .todayCapacity
                                                            .capacity) *
                                                    100,
                                                    100
                                                )
                                                : 0
                                                }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {/* LISTS */}
                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {/* UPCOMING */}
                    <section className="overflow-hidden rounded-2xl border border-rose-100 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Upcoming
                                    Fulfilments
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Next orders to
                                    deliver, post or
                                    pickup.
                                </p>
                            </div>

                            <Link
                                href="/admin/orders"
                                className="text-sm font-medium text-rose-500 hover:text-rose-600"
                            >
                                View All →
                            </Link>
                        </div>

                        {data
                            .upcomingFulfillments
                            .length === 0 ? (
                            <EmptyState text="No upcoming fulfilments." />
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {data.upcomingFulfillments.map(
                                    (order) => (
                                        <Link
                                            key={
                                                order.id
                                            }
                                            href={`/admin/orders/${order.id}`}
                                            className="block p-5 transition hover:bg-gray-50"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {
                                                            order.orderCode
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {
                                                            order.customerName
                                                        }
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap justify-end gap-2">
                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                        {formatLabel(
                                                            order.fulfillmentType
                                                        )}
                                                    </span>

                                                    <span
                                                        className="rounded-full px-3 py-1 text-xs font-semibold"
                                                        style={getOrderStatusStyle(
                                                            order.status
                                                        )}
                                                    >
                                                        {formatLabel(
                                                            order.status
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(
                                                        order.fulfillmentDate
                                                    )}
                                                </p>

                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatMoney(
                                                            order.totalAmount
                                                        )}
                                                    </p>

                                                    {order.balanceAmount >
                                                        0 && (
                                                            <p className="mt-1 text-xs text-red-500">
                                                                Balance{" "}
                                                                {formatMoney(
                                                                    order.balanceAmount
                                                                )}
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>
                        )}
                    </section>

                    {/* PRODUCTION */}
                    <section className="overflow-hidden rounded-2xl border border-rose-100 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Today&apos;s
                                    Production
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Orders scheduled
                                    to start production
                                    today.
                                </p>
                            </div>

                            <Link
                                href="/admin/calendar"
                                className="text-sm font-medium text-rose-500 hover:text-rose-600"
                            >
                                Calendar →
                            </Link>
                        </div>

                        {data.todayProduction
                            .length === 0 ? (
                            <EmptyState text="No production scheduled for today." />
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {data.todayProduction.map(
                                    (order) => (
                                        <Link
                                            key={
                                                order.id
                                            }
                                            href={`/admin/orders/${order.id}`}
                                            className="block p-5 transition hover:bg-gray-50"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {
                                                            order.orderCode
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {
                                                            order.customerName
                                                        }
                                                    </p>
                                                </div>

                                                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                                                    Production
                                                </span>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                                                <span className="text-gray-500">
                                                    Fulfilment{" "}
                                                    {formatDate(
                                                        order.fulfillmentDate
                                                    )}
                                                </span>

                                                <span className="font-medium text-gray-600">
                                                    {formatLabel(
                                                        order.fulfillmentType
                                                    )}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>
                        )}
                    </section>

                    {/* RECENT ORDERS */}
                    <section className="mt-6 overflow-hidden rounded-2xl border border-rose-100 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Recent Orders
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Latest orders added to{" "}
                                    {businessName}.
                                </p>
                            </div>

                            <Link
                                href="/admin/orders"
                                className="text-sm font-medium text-rose-500 hover:text-rose-600"
                            >
                                View All →
                            </Link>
                        </div>

                        {data.recentOrders.length ===
                            0 ? (
                            <EmptyState text="No orders yet." />
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {data.recentOrders.map(
                                    (order) => (
                                        <Link
                                            key={order.id}
                                            href={`/admin/orders/${order.id}`}
                                            className="grid gap-4 p-5 transition hover:bg-gray-50 md:grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr] md:items-center"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        order.orderCode
                                                    }
                                                </p>
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                {
                                                    order.customerName
                                                }
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {formatDate(
                                                    order.fulfillmentDate
                                                )}
                                            </p>

                                            <div>
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                    {formatLabel(
                                                        order.fulfillmentType
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 md:justify-end">
                                                <span
                                                    className="rounded-full px-3 py-1 text-xs font-semibold"
                                                    style={getOrderStatusStyle(
                                                        order.status
                                                    )}
                                                >
                                                    {formatLabel(
                                                        order.status
                                                    )}
                                                </span>

                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatMoney(
                                                        order.totalAmount
                                                    )}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

type SummaryCardProps = {
    label: string;
    value: string;
    href: string;
};

function SummaryCard({
    label,
    value,
    href,
}: SummaryCardProps) {
    return (
        <Link
            href={href}
            className="rounded-2xl border border-rose-100 bg-white p-6 transition hover:border-rose-200 hover:shadow-sm"
        >
            <p className="text-sm font-medium text-gray-500">
                {label}
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
                {value}
            </p>

            <p className="mt-4 text-xs font-medium text-rose-500">
                View details →
            </p>
        </Link>
    );
}

type DashboardMetricProps = {
    label: string;
    value: string;
};

function DashboardMetric({
    label,
    value,
}: DashboardMetricProps) {
    return (
        <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}

type EmptyStateProps = {
    text: string;
};

function EmptyState({
    text,
}: EmptyStateProps) {
    return (
        <div className="p-10 text-center">
            <p className="text-sm font-medium text-gray-400">
                {text}
            </p>
        </div>
    );
}

type QuickActionProps = {
    href: string;
    label: string;
};

function QuickAction({
    href,
    label,
}: QuickActionProps) {
    return (
        <Link
            href={href}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        >
            {label}
        </Link>
    );
}

function getOrderStatusStyle(
    status: string
) {
    switch (status) {
        case "pending":
            return {
                backgroundColor:
                    "#FEF3C7",
                color: "#92400E",
            };

        case "confirmed":
            return {
                backgroundColor:
                    "#DBEAFE",
                color: "#1E3A8A",
            };

        case "preparing":
            return {
                backgroundColor:
                    "#F3E8FF",
                color: "#581C87",
            };

        case "ready":
            return {
                backgroundColor:
                    "#DCFCE7",
                color: "#166534",
            };

        case "completed":
            return {
                backgroundColor:
                    "#F3F4F6",
                color: "#374151",
            };

        case "cancelled":
            return {
                backgroundColor:
                    "#FEE2E2",
                color: "#991B1B",
            };

        default:
            return {
                backgroundColor:
                    "#F3F4F6",
                color: "#374151",
            };
    }
}
"use client";

import Link from "next/link";
import {
    useMemo,
    useState,
} from "react";

import {
    FulfillmentType,
    Order,
    OrderStatus,
    PaymentStatus,
} from "../types/order.types";

type AdminOrdersScreenProps = {
    orders: Order[];
};

type OrderStatusFilter =
    | "all"
    | OrderStatus;

type PaymentStatusFilter =
    | "all"
    | PaymentStatus;

type FulfillmentFilter =
    | "all"
    | FulfillmentType;

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
        new Date(`${value}T00:00:00`)
    );
}

function getStatusLabel(
    status: OrderStatus
) {
    switch (status) {
        case "pending":
            return "Pending";

        case "confirmed":
            return "Confirmed";

        case "preparing":
            return "Preparing";

        case "ready":
            return "Ready";

        case "completed":
            return "Completed";

        case "cancelled":
            return "Cancelled";
    }
}

function getPaymentLabel(
    status: PaymentStatus
) {
    switch (status) {
        case "unpaid":
            return "Unpaid";

        case "partial":
            return "Partial";

        case "paid":
            return "Paid";

        case "refunded":
            return "Refunded";
    }
}

function getFulfillmentLabel(
    type: FulfillmentType
) {
    switch (type) {
        case "delivery":
            return "Delivery";

        case "postage":
            return "Postage";

        case "pickup":
            return "Pickup";
    }
}

export function AdminOrdersScreen({
    orders,
}: AdminOrdersScreenProps) {
    const [search, setSearch] =
        useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] =
        useState<OrderStatusFilter>(
            "all"
        );

    const [
        paymentFilter,
        setPaymentFilter,
    ] =
        useState<PaymentStatusFilter>(
            "all"
        );

    const [
        fulfillmentFilter,
        setFulfillmentFilter,
    ] =
        useState<FulfillmentFilter>(
            "all"
        );

    const filteredOrders =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return orders.filter(
                (order) => {
                    const matchesSearch =
                        !query ||
                        order.orderCode
                            .toLowerCase()
                            .includes(query) ||
                        order.customerName
                            .toLowerCase()
                            .includes(query) ||
                        order.customerCode
                            .toLowerCase()
                            .includes(query) ||
                        order.customerPhone
                            .toLowerCase()
                            .includes(query) ||
                        order.recipientName
                            ?.toLowerCase()
                            .includes(query);

                    const matchesStatus =
                        statusFilter === "all" ||
                        order.status ===
                        statusFilter;

                    const matchesPayment =
                        paymentFilter === "all" ||
                        order.paymentStatus ===
                        paymentFilter;

                    const matchesFulfillment =
                        fulfillmentFilter ===
                        "all" ||
                        order.fulfillmentType ===
                        fulfillmentFilter;

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesPayment &&
                        matchesFulfillment
                    );
                }
            );
        }, [
            orders,
            search,
            statusFilter,
            paymentFilter,
            fulfillmentFilter,
        ]);

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            Order Management
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900">
                            Orders
                        </h1>

                        <p className="mt-3 text-gray-600">
                            Manage customer orders,
                            fulfilment and payment
                            status.
                        </p>
                    </div>

                    <Link
                        href="/admin/orders/new"
                        className="shrink-0 rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600"
                    >
                        + Add Order
                    </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_180px_180px_180px]">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search order, customer, phone or recipient..."
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                    />

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target
                                    .value as OrderStatusFilter
                            )
                        }
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="all">
                            All Status
                        </option>
                        <option value="pending">
                            Pending
                        </option>
                        <option value="confirmed">
                            Confirmed
                        </option>
                        <option value="preparing">
                            Preparing
                        </option>
                        <option value="ready">
                            Ready
                        </option>
                        <option value="completed">
                            Completed
                        </option>
                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>

                    <select
                        value={paymentFilter}
                        onChange={(event) =>
                            setPaymentFilter(
                                event.target
                                    .value as PaymentStatusFilter
                            )
                        }
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="all">
                            All Payment
                        </option>
                        <option value="unpaid">
                            Unpaid
                        </option>
                        <option value="partial">
                            Partial
                        </option>
                        <option value="paid">
                            Paid
                        </option>
                        <option value="refunded">
                            Refunded
                        </option>
                    </select>

                    <select
                        value={
                            fulfillmentFilter
                        }
                        onChange={(event) =>
                            setFulfillmentFilter(
                                event.target
                                    .value as FulfillmentFilter
                            )
                        }
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="all">
                            All Fulfilment
                        </option>
                        <option value="delivery">
                            Delivery
                        </option>
                        <option value="postage">
                            Postage
                        </option>
                        <option value="pickup">
                            Pickup
                        </option>
                    </select>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-rose-100 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-100 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Order
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Fulfilment
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Total
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Payment
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map(
                                    (order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        order.orderCode
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    Created{" "}
                                                    {new Intl.DateTimeFormat(
                                                        "en-MY"
                                                    ).format(
                                                        new Date(
                                                            order.createdAt
                                                        )
                                                    )}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-medium text-gray-900">
                                                    {
                                                        order.customerName
                                                    }
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {
                                                        order.customerCode
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        order.customerPhone
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-medium text-gray-900">
                                                    {formatDate(
                                                        order.fulfillmentDate
                                                    )}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {getFulfillmentLabel(
                                                        order.fulfillmentType
                                                    )}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-gray-900">
                                                    RM{" "}
                                                    {order.totalAmount.toFixed(
                                                        2
                                                    )}
                                                </p>

                                                {order.balanceAmount >
                                                    0 && (
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            Balance RM{" "}
                                                            {order.balanceAmount.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                    {getPaymentLabel(
                                                        order.paymentStatus
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                    {getStatusLabel(
                                                        order.status
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-sm font-medium text-rose-500 hover:text-rose-600"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length ===
                        0 && (
                            <div className="p-12 text-center">
                                <p className="font-medium text-gray-600">
                                    No orders found.
                                </p>

                                <p className="mt-2 text-sm text-gray-400">
                                    {orders.length === 0
                                        ? "Add your first order to get started."
                                        : "Try changing your search or filters."}
                                </p>
                            </div>
                        )}
                </div>

                <p className="mt-4 text-sm text-gray-400">
                    Showing{" "}
                    {filteredOrders.length} of{" "}
                    {orders.length} orders
                </p>
            </div>
        </main>
    );
}
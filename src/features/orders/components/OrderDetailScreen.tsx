import Link from "next/link";

import { OrderDetail } from "../types/order.types";
import { CancelOrderButton } from "./CancelOrderButton";

type OrderDetailScreenProps = {
    order: OrderDetail;
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
        new Date(`${value}T00:00:00`)
    );
}

function formatLabel(
    value: string
) {
    return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}

export function OrderDetailScreen({
    order,
}: OrderDetailScreenProps) {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            Order Management
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900">
                            {order.orderCode}
                        </h1>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                {formatLabel(
                                    order.status
                                )}
                            </span>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                {formatLabel(
                                    order.paymentStatus
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {order.status !==
                            "cancelled" &&
                            order.status !==
                            "completed" && (
                                <CancelOrderButton
                                    orderId={order.id}
                                    orderCode={
                                        order.orderCode
                                    }
                                />
                            )}

                        <Link
                            href={`/admin/orders/${order.id}/edit`}
                            className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600"
                        >
                            Edit Order
                        </Link>
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border border-rose-100 bg-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Customer
                        </h2>

                        <div className="mt-5 space-y-2">
                            <p className="font-semibold text-gray-900">
                                {order.customerName}
                            </p>

                            <p className="text-sm text-gray-500">
                                {order.customerCode}
                            </p>

                            <p className="text-sm text-gray-700">
                                {order.customerPhone}
                            </p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-rose-100 bg-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recipient
                        </h2>

                        <div className="mt-5 space-y-2">
                            <p className="font-semibold text-gray-900">
                                {order.recipientName ??
                                    order.customerName}
                            </p>

                            <p className="text-sm text-gray-700">
                                {order.recipientPhone ??
                                    order.customerPhone}
                            </p>
                        </div>
                    </section>
                </div>

                <section className="mt-6 rounded-2xl border border-rose-100 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Order Items
                    </h2>

                    <div className="mt-6 divide-y divide-gray-100">
                        {order.items.map(
                            (item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-1 gap-3 py-5 md:grid-cols-[1fr_100px_140px_140px]"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {item.itemName}
                                        </p>

                                        {item.productCode && (
                                            <p className="mt-1 text-sm text-gray-400">
                                                {
                                                    item.productCode
                                                }
                                            </p>
                                        )}

                                        {item.customizationNotes && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                {
                                                    item.customizationNotes
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Qty
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900">
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Unit Price
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900">
                                            RM{" "}
                                            {item.unitPrice.toFixed(
                                                2
                                            )}
                                        </p>
                                    </div>

                                    <div className="md:text-right">
                                        <p className="text-xs text-gray-400">
                                            Total
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            RM{" "}
                                            {item.lineTotal.toFixed(
                                                2
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </section>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border border-rose-100 bg-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Fulfilment
                        </h2>

                        <div className="mt-5 space-y-4">
                            <DetailRow
                                label="Type"
                                value={formatLabel(
                                    order.fulfillmentType
                                )}
                            />

                            <DetailRow
                                label="Fulfilment Date"
                                value={formatDate(
                                    order.fulfillmentDate
                                )}
                            />

                            <DetailRow
                                label="Production Start"
                                value={
                                    order.productionStartDate
                                        ? formatDate(
                                            order.productionStartDate
                                        )
                                        : "—"
                                }
                            />

                            {order.fulfillmentAddress && (
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Address
                                    </p>

                                    <p className="mt-1 whitespace-pre-line text-sm text-gray-900">
                                        {
                                            order.fulfillmentAddress
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-rose-100 bg-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Payment
                        </h2>

                        <div className="mt-5 space-y-3">
                            <MoneyRow
                                label="Subtotal"
                                value={order.subtotal}
                            />

                            <MoneyRow
                                label="Fulfilment Fee"
                                value={
                                    order.fulfillmentFee
                                }
                            />

                            <MoneyRow
                                label="Discount"
                                value={
                                    -order.discountAmount
                                }
                            />

                            <div className="border-t border-gray-100" />

                            <MoneyRow
                                label="Total"
                                value={
                                    order.totalAmount
                                }
                                strong
                            />

                            <MoneyRow
                                label="Amount Paid"
                                value={
                                    order.amountPaid
                                }
                            />

                            <MoneyRow
                                label="Balance"
                                value={
                                    order.balanceAmount
                                }
                                strong
                            />

                            <DetailRow
                                label="Payment Method"
                                value={
                                    order.paymentMethod
                                        ? formatLabel(
                                            order.paymentMethod
                                        )
                                        : "—"
                                }
                            />
                        </div>
                    </section>
                </div>

                {(order.customerNotes ||
                    order.adminNotes) && (
                        <section className="mt-6 rounded-2xl border border-rose-100 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Notes
                            </h2>

                            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Customer Notes
                                    </p>

                                    <p className="mt-2 whitespace-pre-line text-sm text-gray-900">
                                        {order.customerNotes ??
                                            "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Admin Notes
                                    </p>

                                    <p className="mt-2 whitespace-pre-line text-sm text-gray-900">
                                        {order.adminNotes ??
                                            "—"}
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                <div className="mt-8">
                    <Link
                        href="/admin/orders"
                        className="text-sm font-medium text-rose-500 hover:text-rose-600"
                    >
                        ← Back to Orders
                    </Link>
                </div>
            </div>
        </main>
    );
}

type DetailRowProps = {
    label: string;
    value: string;
};

function DetailRow({
    label,
    value,
}: DetailRowProps) {
    return (
        <div className="flex items-center justify-between gap-6">
            <span className="text-sm text-gray-500">
                {label}
            </span>

            <span className="text-right text-sm font-medium text-gray-900">
                {value}
            </span>
        </div>
    );
}

type MoneyRowProps = {
    label: string;
    value: number;
    strong?: boolean;
};

function MoneyRow({
    label,
    value,
    strong = false,
}: MoneyRowProps) {
    return (
        <div className="flex items-center justify-between gap-6">
            <span
                className={
                    strong
                        ? "font-semibold text-gray-900"
                        : "text-sm text-gray-500"
                }
            >
                {label}
            </span>

            <span
                className={
                    strong
                        ? "font-bold text-rose-500"
                        : "font-medium text-gray-900"
                }
            >
                {value < 0 ? "-" : ""}
                RM{" "}
                {Math.abs(value).toFixed(2)}
            </span>
        </div>
    );
}
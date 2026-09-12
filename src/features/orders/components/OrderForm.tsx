"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { Customer } from "@/features/customers/types/customer.types";
import { Product } from "@/features/products/types/product.types";
import { getCapacityAvailability } from "@/features/capacity/services/capacity-availability.service";
import { CapacityAvailability } from "@/features/capacity/types/capacity-availability.types";

import {
    createOrder,
    updateOrder,
} from "../services/order-admin.service";

import {
    FulfillmentType,
    OrderDetail,
    OrderStatus,
    PaymentMethod,
} from "../types/order.types";

type OrderFormProps = {
    customers: Customer[];
    products: Product[];

    mode?: "create" | "edit";
    order?: OrderDetail;

    defaultPrepDays?: number;
};

type OrderItemInput = {
    id: string;

    source:
    | "product"
    | "custom";

    productId: string;
    productCode: string;

    itemName: string;
    quantity: string;
    unitPrice: string;

    customizationNotes: string;
};

function createEmptyItem(): OrderItemInput {
    return {
        id: crypto.randomUUID(),

        source: "product",

        productId: "",
        productCode: "",

        itemName: "",
        quantity: "1",
        unitPrice: "",

        customizationNotes: "",
    };
}

function createInitialItems(
    order?: OrderDetail
): OrderItemInput[] {
    if (
        !order ||
        order.items.length === 0
    ) {
        return [
            createEmptyItem(),
        ];
    }

    return order.items.map(
        (item) => ({
            id: item.id,

            source:
                item.productId
                    ? "product"
                    : "custom",

            productId:
                item.productId ?? "",

            productCode:
                item.productCode ?? "",

            itemName:
                item.itemName,

            quantity:
                String(item.quantity),

            unitPrice:
                String(item.unitPrice),

            customizationNotes:
                item.customizationNotes ??
                "",
        })
    );
}

export function OrderForm({
    customers,
    products,
    mode = "create",
    order,
    defaultPrepDays = 3


}: OrderFormProps) {
    const router = useRouter();

    const [
        customerId,
        setCustomerId,
    ] = useState(
        order?.customerId ?? ""
    );

    const [
        recipientName,
        setRecipientName,
    ] = useState(
        order?.recipientName ?? ""
    );

    const [
        recipientPhone,
        setRecipientPhone,
    ] = useState(
        order?.recipientPhone ?? ""
    );

    const [
        fulfillmentType,
        setFulfillmentType,
    ] =
        useState<FulfillmentType>(
            order?.fulfillmentType ??
            "delivery"
        );

    const [
        fulfillmentDate,
        setFulfillmentDate,
    ] = useState(
        order?.fulfillmentDate ?? ""
    );

    const [
        capacityAvailability,
        setCapacityAvailability,
    ] =
        useState<CapacityAvailability | null>(
            null
        );

    const [
        isCheckingCapacity,
        setIsCheckingCapacity,
    ] =
        useState(false);

    const [
        capacityError,
        setCapacityError,
    ] =
        useState("");

    const [
        allowCapacityOverride,
        setAllowCapacityOverride,
    ] = useState(false);

    const [
        prepDays,
        setPrepDays,
    ] = useState(
        mode === "edit"
            ? order?.prepDays ??
            defaultPrepDays
            : defaultPrepDays
    );

    const [
        fulfillmentAddress,
        setFulfillmentAddress,
    ] = useState(
        order?.fulfillmentAddress ??
        ""
    );

    const [
        fulfillmentFee,
        setFulfillmentFee,
    ] = useState(
        String(
            order?.fulfillmentFee ??
            0
        )
    );

    const [
        discountAmount,
        setDiscountAmount,
    ] = useState(
        String(
            order?.discountAmount ??
            0
        )
    );

    const [
        amountPaid,
        setAmountPaid,
    ] = useState(
        String(
            order?.amountPaid ?? 0
        )
    );

    const [
        paymentMethod,
        setPaymentMethod,
    ] = useState<
        PaymentMethod | ""
    >(
        order?.paymentMethod ?? ""
    );

    const [status, setStatus] =
        useState<OrderStatus>(
            order?.status ?? "pending"
        );

    const [
        customerNotes,
        setCustomerNotes,
    ] = useState(
        order?.customerNotes ?? ""
    );

    const [
        adminNotes,
        setAdminNotes,
    ] = useState(
        order?.adminNotes ?? ""
    );

    const [items, setItems] =
        useState<OrderItemInput[]>(
            () =>
                createInitialItems(
                    order
                )
        );

    const [error, setError] =
        useState("");

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    useEffect(() => {
        if (!fulfillmentDate) {
            return;
        }

        let cancelled = false;

        async function checkCapacity() {
            try {
                const availability =
                    await getCapacityAvailability(
                        fulfillmentDate,
                        mode === "edit"
                            ? order?.id
                            : undefined
                    );

                if (!cancelled) {
                    setCapacityAvailability(
                        availability
                    );

                    setCapacityError("");
                }
            } catch (error) {
                if (!cancelled) {
                    setCapacityAvailability(
                        null
                    );

                    if (
                        error instanceof Error
                    ) {
                        setCapacityError(
                            error.message
                        );
                    } else {
                        setCapacityError(
                            "Unable to check capacity."
                        );
                    }
                }
            } finally {
                if (!cancelled) {
                    setIsCheckingCapacity(
                        false
                    );
                }
            }
        }

        void checkCapacity();

        return () => {
            cancelled = true;
        };
    }, [
        fulfillmentDate,
        mode,
        order?.id,
    ]);

    function handleFulfillmentDateChange(
        value: string
    ) {
        setFulfillmentDate(value);

        setCapacityAvailability(
            null
        );

        setCapacityError("");

        setAllowCapacityOverride(
            false
        );

        setIsCheckingCapacity(
            Boolean(value)
        );
    }

    function addItem() {
        setItems((current) => [
            ...current,
            createEmptyItem(),
        ]);
    }

    function removeItem(
        itemId: string
    ) {
        setItems((current) =>
            current.filter(
                (item) =>
                    item.id !== itemId
            )
        );
    }

    function updateItem(
        itemId: string,
        changes: Partial<OrderItemInput>
    ) {
        setItems((current) =>
            current.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        ...changes,
                    }
                    : item
            )
        );
    }

    function handleProductChange(
        itemId: string,
        value: string
    ) {
        if (value === "custom") {
            updateItem(
                itemId,
                {
                    source: "custom",
                    productId: "",
                    productCode: "",
                    itemName: "",
                    unitPrice: "",
                }
            );

            return;
        }

        const product =
            products.find(
                (product) =>
                    product.id === value
            );

        if (!product) {
            updateItem(
                itemId,
                {
                    source: "product",
                    productId: "",
                    productCode: "",
                    itemName: "",
                    unitPrice: "",
                }
            );

            return;
        }

        updateItem(
            itemId,
            {
                source: "product",

                productId:
                    product.id,

                productCode:
                    product.productCode,

                itemName:
                    product.name,

                unitPrice:
                    String(
                        product.price
                    ),
            }
        );
    }

    const subtotal =
        items.reduce(
            (total, item) => {
                return (
                    total +
                    (Number(
                        item.quantity
                    ) || 0) *
                    (Number(
                        item.unitPrice
                    ) || 0)
                );
            },
            0
        );

    const deliveryFee =
        Number(
            fulfillmentFee
        ) || 0;

    const discount =
        Number(
            discountAmount
        ) || 0;

    const paid =
        Number(
            amountPaid
        ) || 0;

    const totalAmount =
        Math.max(
            subtotal +
            deliveryFee -
            discount,
            0
        );

    const balanceAmount =
        Math.max(
            totalAmount - paid,
            0
        );

    const paymentStatus =
        paid <= 0
            ? "Unpaid"
            : paid < totalAmount
                ? "Partial"
                : "Paid";

    function getProductionStartDate() {
        if (!fulfillmentDate) {
            return "";
        }

        const [
            year,
            month,
            day,
        ] =
            fulfillmentDate
                .split("-")
                .map(Number);

        const date =
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day
                )
            );

        date.setUTCDate(
            date.getUTCDate() -
            (Number(prepDays) ||
                0)
        );

        return date
            .toISOString()
            .slice(0, 10);
    }

    const productionStartDate =
        getProductionStartDate();

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (isCheckingCapacity) {
            setError(
                "Please wait while capacity is being checked."
            );

            return;
        }

        if (capacityError) {
            setError(
                "Unable to verify capacity for the selected date."
            );

            return;
        }

        if (
            capacityAvailability &&
            (
                capacityAvailability.isBlocked ||
                capacityAvailability.isFull
            ) &&
            !allowCapacityOverride
        ) {
            setError(
                capacityAvailability.isBlocked
                    ? "This date is blocked. Please confirm the capacity override to continue."
                    : "This date is fully booked. Please confirm the capacity override to continue."
            );

            return;
        }

        setIsLoading(true);

        try {
            const formData = {
                customerId,

                recipientName,
                recipientPhone,

                fulfillmentType,
                fulfillmentDate,

                prepDays:
                    Number(prepDays),

                fulfillmentAddress,

                fulfillmentFee:
                    Number(
                        fulfillmentFee
                    ),

                discountAmount:
                    Number(
                        discountAmount
                    ),

                amountPaid:
                    Number(amountPaid),

                paymentMethod:
                    paymentMethod ||
                    undefined,

                status,

                customerNotes,
                adminNotes,

                items:
                    items.map(
                        (item) => ({
                            productId:
                                item.source ===
                                    "product"
                                    ? item.productId
                                    : undefined,

                            productCode:
                                item.source ===
                                    "product"
                                    ? item.productCode
                                    : undefined,

                            itemName:
                                item.itemName,

                            quantity:
                                Number(
                                    item.quantity
                                ),

                            unitPrice:
                                Number(
                                    item.unitPrice
                                ),

                            customizationNotes:
                                item.customizationNotes,
                        })
                    ),
            };
            if (
                mode === "edit" &&
                order
            ) {
                await updateOrder(
                    order.id,
                    formData
                );

                router.push(
                    `/admin/orders/${order.id}`
                );
            } else {
                await createOrder(
                    formData
                );

                router.push(
                    "/admin/orders"
                );
            }

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Unable to create order."
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-8"
        >
            {/* CUSTOMER */}
            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Customer
                </h2>

                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Customer
                    </label>

                    <select
                        value={customerId}
                        onChange={(event) =>
                            setCustomerId(
                                event.target.value
                            )
                        }
                        required
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="">
                            Select customer
                        </option>

                        {customers.map(
                            (customer) => (
                                <option
                                    key={
                                        customer.id
                                    }
                                    value={
                                        customer.id
                                    }
                                >
                                    {
                                        customer.customerCode
                                    }{" "}
                                    —{" "}
                                    {customer.name}{" "}
                                    —{" "}
                                    {customer.phone}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>

            {/* RECIPIENT */}
            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Recipient
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Leave blank if the customer
                    is also the recipient.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Recipient Name
                        </label>

                        <input
                            type="text"
                            value={
                                recipientName
                            }
                            onChange={(event) =>
                                setRecipientName(
                                    event.target
                                        .value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Recipient Phone
                        </label>

                        <input
                            type="tel"
                            value={
                                recipientPhone
                            }
                            onChange={(event) =>
                                setRecipientPhone(
                                    event.target
                                        .value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>
                </div>
            </div>

            {/* ITEMS */}
            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Order Items
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Add catalog products or
                            custom items.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={addItem}
                        className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
                    >
                        + Add Item
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {items.map(
                        (item) => {
                            const lineTotal =
                                (Number(
                                    item.quantity
                                ) || 0) *
                                (Number(
                                    item.unitPrice
                                ) || 0);

                            return (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-gray-100 p-5"
                                >
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_100px_150px_150px_auto]">
                                        <div>
                                            <label className="mb-2 block text-xs font-medium text-gray-500">
                                                Product
                                            </label>

                                            <select
                                                value={
                                                    item.source ===
                                                        "custom"
                                                        ? "custom"
                                                        : item.productId
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleProductChange(
                                                        item.id,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                required
                                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-rose-400"
                                            >
                                                <option value="">
                                                    Select product
                                                </option>

                                                <option value="custom">
                                                    + Custom Item
                                                </option>

                                                {products.map(
                                                    (product) => (
                                                        <option
                                                            key={
                                                                product.id
                                                            }
                                                            value={
                                                                product.id
                                                            }
                                                        >
                                                            {
                                                                product.productCode
                                                            }{" "}
                                                            —{" "}
                                                            {
                                                                product.name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-xs font-medium text-gray-500">
                                                Qty
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={
                                                    item.quantity
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateItem(
                                                        item.id,
                                                        {
                                                            quantity:
                                                                event
                                                                    .target
                                                                    .value,
                                                        }
                                                    )
                                                }
                                                required
                                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-rose-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-xs font-medium text-gray-500">
                                                Unit Price
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={
                                                    item.unitPrice
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateItem(
                                                        item.id,
                                                        {
                                                            unitPrice:
                                                                event
                                                                    .target
                                                                    .value,
                                                        }
                                                    )
                                                }
                                                required
                                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-rose-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-xs font-medium text-gray-500">
                                                Total
                                            </label>

                                            <div className="py-2.5 font-semibold text-gray-900">
                                                RM{" "}
                                                {lineTotal.toFixed(
                                                    2
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                disabled={
                                                    items.length ===
                                                    1
                                                }
                                                onClick={() =>
                                                    removeItem(
                                                        item.id
                                                    )
                                                }
                                                className="rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-30"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {item.source ===
                                        "custom" && (
                                            <div className="mt-4">
                                                <label className="mb-2 block text-xs font-medium text-gray-500">
                                                    Custom Item Name
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        item.itemName
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateItem(
                                                            item.id,
                                                            {
                                                                itemName:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    required
                                                    placeholder="Example: Custom Money Bouquet"
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                                                />
                                            </div>
                                        )}

                                    <div className="mt-4">
                                        <label className="mb-2 block text-xs font-medium text-gray-500">
                                            Customization Notes
                                        </label>

                                        <textarea
                                            rows={2}
                                            value={
                                                item.customizationNotes
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateItem(
                                                    item.id,
                                                    {
                                                        customizationNotes:
                                                            event
                                                                .target
                                                                .value,
                                                    }
                                                )
                                            }
                                            placeholder="Example: Purple wrapping, congratulations card..."
                                            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                                        />
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            {/* FULFILMENT */}
            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Fulfilment
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Fulfilment Type
                        </label>

                        <select
                            value={
                                fulfillmentType
                            }
                            onChange={(
                                event
                            ) =>
                                setFulfillmentType(
                                    event.target
                                        .value as FulfillmentType
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        >
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

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Fulfilment Date
                        </label>

                        <input
                            type="date"
                            value={
                                fulfillmentDate
                            }
                            onChange={(event) =>
                                handleFulfillmentDateChange(
                                    event.target.value
                                )
                            }
                            required
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                        {isCheckingCapacity && (
                            <p className="mt-2 text-xs text-gray-400">
                                Checking capacity...
                            </p>
                        )}

                        {capacityError && (
                            <p className="mt-2 text-xs text-red-500">
                                Unable to check capacity:{" "}
                                {capacityError}
                            </p>
                        )}

                        {capacityAvailability &&
                            !isCheckingCapacity && (
                                <div className="mt-3">
                                    {capacityAvailability.isBlocked ? (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                                            <p className="text-sm font-semibold text-red-700">
                                                ⛔ This date is blocked.
                                            </p>

                                            {capacityAvailability.notes && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {
                                                        capacityAvailability.notes
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    ) : capacityAvailability.isFull ? (
                                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                                            <p className="text-sm font-semibold text-amber-700">
                                                ⚠ This date is fully booked.
                                            </p>

                                            <p className="mt-1 text-xs text-amber-600">
                                                {
                                                    capacityAvailability.bookedOrders
                                                }
                                                /
                                                {
                                                    capacityAvailability.capacity
                                                }{" "}
                                                orders booked.
                                            </p>

                                            {capacityAvailability.notes && (
                                                <p className="mt-1 text-xs text-amber-600">
                                                    {
                                                        capacityAvailability.notes
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                                            <p className="text-sm font-semibold text-green-700">
                                                ✓{" "}
                                                {
                                                    capacityAvailability.availableSlots
                                                }{" "}
                                                slot
                                                {capacityAvailability.availableSlots ===
                                                    1
                                                    ? ""
                                                    : "s"}{" "}
                                                available
                                            </p>

                                            <p className="mt-1 text-xs text-green-600">
                                                {
                                                    capacityAvailability.bookedOrders
                                                }
                                                /
                                                {
                                                    capacityAvailability.capacity
                                                }{" "}
                                                orders booked.
                                            </p>

                                            {capacityAvailability.notes && (
                                                <p className="mt-1 text-xs text-green-600">
                                                    {
                                                        capacityAvailability.notes
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        {capacityAvailability &&
                            !isCheckingCapacity &&
                            (
                                capacityAvailability.isBlocked ||
                                capacityAvailability.isFull
                            ) && (
                                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                    <input
                                        type="checkbox"
                                        checked={
                                            allowCapacityOverride
                                        }
                                        onChange={(event) =>
                                            setAllowCapacityOverride(
                                                event.target.checked
                                            )
                                        }
                                        className="mt-1 h-4 w-4"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-amber-800">
                                            Allow capacity override
                                        </p>

                                        <p className="mt-1 text-xs text-amber-700">
                                            I understand this date
                                            is currently unavailable
                                            or fully booked and want
                                            to continue with this
                                            order.
                                        </p>
                                    </div>
                                </label>
                            )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Prep Days
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="30"
                            value={prepDays}
                            onChange={(event) =>
                                setPrepDays(
                                    Number(
                                        event.target.value
                                    )
                                )
                            
                            }
                        required
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />

                        {productionStartDate && (
                            <p className="mt-2 text-xs text-gray-500">
                                Production starts:{" "}
                                {
                                    productionStartDate
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Fulfilment Fee (RM)
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                fulfillmentFee
                            }
                            onChange={(
                                event
                            ) =>
                                setFulfillmentFee(
                                    event.target
                                        .value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>
                </div>

                {fulfillmentType !==
                    "pickup" && (
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                {fulfillmentType ===
                                    "delivery"
                                    ? "Delivery Address"
                                    : "Postage Address"}
                            </label>

                            <textarea
                                rows={4}
                                value={
                                    fulfillmentAddress
                                }
                                onChange={(
                                    event
                                ) =>
                                    setFulfillmentAddress(
                                        event.target
                                            .value
                                    )
                                }
                                required
                                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                            />
                        </div>
                    )}
            </div>

            {/* PAYMENT */}
            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Payment
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Discount (RM)
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                discountAmount
                            }
                            onChange={(
                                event
                            ) =>
                                setDiscountAmount(
                                    event.target
                                        .value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Amount Paid (RM)
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                amountPaid
                            }
                            onChange={(
                                event
                            ) =>
                                setAmountPaid(
                                    event.target
                                        .value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Payment Method
                        </label>

                        <select
                            value={
                                paymentMethod
                            }
                            onChange={(
                                event
                            ) =>
                                setPaymentMethod(
                                    event.target
                                        .value as
                                    | PaymentMethod
                                    | ""
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        >
                            <option value="">
                                Not selected
                            </option>

                            <option value="cash">
                                Cash
                            </option>

                            <option value="bank_transfer">
                                Bank Transfer
                            </option>

                            <option value="duitnow">
                                DuitNow
                            </option>

                            <option value="tng">
                                TNG
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* STATUS + NOTES */}
            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Order Information
                </h2>

                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Order Status
                    </label>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target
                                    .value as OrderStatus
                            )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400 md:max-w-sm"
                    >
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
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Customer Notes
                        </label>

                        <textarea
                            rows={4}
                            value={
                                customerNotes
                            }
                            onChange={(
                                event
                            ) =>
                                setCustomerNotes(
                                    event.target
                                        .value
                                )
                            }
                            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Admin Notes
                        </label>

                        <textarea
                            rows={4}
                            value={
                                adminNotes
                            }
                            onChange={(
                                event
                            ) =>
                                setAdminNotes(
                                    event.target
                                        .value
                                )
                            }
                            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Order Summary
                </h2>

                <div className="mt-6 space-y-3">
                    <SummaryRow
                        label="Subtotal"
                        value={subtotal}
                    />

                    <SummaryRow
                        label="Fulfilment Fee"
                        value={deliveryFee}
                    />

                    <SummaryRow
                        label="Discount"
                        value={-discount}
                    />

                    <div className="border-t border-gray-100" />

                    <SummaryRow
                        label="Total"
                        value={totalAmount}
                        strong
                    />

                    <SummaryRow
                        label="Amount Paid"
                        value={paid}
                    />

                    <SummaryRow
                        label="Balance"
                        value={balanceAmount}
                        strong
                    />

                    <div className="flex justify-between pt-2 text-sm">
                        <span className="text-gray-600">
                            Payment Status
                        </span>

                        <span className="font-semibold text-gray-900">
                            {paymentStatus}
                        </span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                        router.push(
                            "/admin/orders"
                        )
                    }
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={
                        isLoading ||
                        isCheckingCapacity
                    }
                >
                    {isLoading
                        ? "Saving..."
                        : isCheckingCapacity
                            ? "Checking Capacity..."
                            : mode === "edit"
                                ? "Update Order"
                                : "Save Order"}
                </Button>
            </div>
        </form>
    );
}

type SummaryRowProps = {
    label: string;
    value: number;
    strong?: boolean;
};

function SummaryRow({
    label,
    value,
    strong = false,
}: SummaryRowProps) {
    return (
        <div className="flex items-center justify-between">
            <span
                className={
                    strong
                        ? "font-semibold text-gray-900"
                        : "text-sm text-gray-600"
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
                {value < 0
                    ? "-"
                    : ""}
                RM{" "}
                {Math.abs(value).toFixed(
                    2
                )}
            </span>
        </div>
    );
}
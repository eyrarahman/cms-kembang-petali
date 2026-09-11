"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cancelOrder } from "../services/order-admin.service";

type CancelOrderButtonProps = {
    orderId: string;
    orderCode: string;
};

export function CancelOrderButton({
    orderId,
    orderCode,
}: CancelOrderButtonProps) {
    const router = useRouter();

    const [
        isCancelling,
        setIsCancelling,
    ] = useState(false);

    async function handleCancel() {
        const confirmed =
            window.confirm(
                `Cancel ${orderCode}?\n\nThe order will remain in the system for historical records.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setIsCancelling(true);

            await cancelOrder(
                orderId
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                alert(
                    `Unable to cancel order: ${error.message}`
                );
            } else {
                alert(
                    "Unable to cancel order."
                );
            }
        } finally {
            setIsCancelling(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isCancelling
                ? "Cancelling..."
                : "Cancel Order"}
        </button>
    );
}
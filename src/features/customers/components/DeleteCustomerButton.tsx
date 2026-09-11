"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    deleteCustomer,
    getCustomerOrderUsage,
} from "../services/customer-admin.service";

type DeleteCustomerButtonProps = {
    customerId: string;
    customerName: string;
};

export function DeleteCustomerButton({
    customerId,
    customerName,
}: DeleteCustomerButtonProps) {
    const router = useRouter();

    const [isDeleting, setIsDeleting] =
        useState(false);

    async function handleDelete() {
        try {
            setIsDeleting(true);

            const usage =
                await getCustomerOrderUsage(
                    customerId
                );

            if (usage.count > 0) {
                const orderList =
                    usage.orders
                        .slice(0, 5)
                        .map(
                            (order) =>
                                `• ${order.orderCode} — ${order.status}`
                        )
                        .join("\n");

                const remaining =
                    usage.count > 5
                        ? `\n• +${usage.count - 5} more order(s)`
                        : "";

                window.alert(
                    `Cannot delete "${customerName}".\n\n` +
                    `This customer has ${usage.count} order${usage.count === 1
                        ? ""
                        : "s"
                    }:\n\n` +
                    `${orderList}${remaining}\n\n` +
                    `Set the customer to Inactive instead to preserve order history.`
                );

                return;
            }

            const confirmed =
                window.confirm(
                    `Are you sure you want to delete "${customerName}"?\n\nThis action cannot be undone.`
                );

            if (!confirmed) {
                return;
            }

            await deleteCustomer(
                customerId
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                alert(
                    `Unable to delete customer: ${error.message}`
                );
            } else {
                alert(
                    "Unable to delete customer."
                );
            }
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm font-medium text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isDeleting
                ? "Deleting..."
                : "Delete"}
        </button>
    );
}
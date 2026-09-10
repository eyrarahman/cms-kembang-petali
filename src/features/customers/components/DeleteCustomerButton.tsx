"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCustomer } from "../services/customer-admin.service";

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
        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${customerName}"?\n\nThis action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);

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
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteProduct } from "../services/product-admin.service";

type DeleteProductButtonProps = {
    productId: string;
    productName: string;
};

export function DeleteProductButton({
    productId,
    productName,
}: DeleteProductButtonProps) {
    const router = useRouter();

    const [isDeleting, setIsDeleting] =
        useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);

            await deleteProduct(
                productId
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                alert(
                    `Unable to delete product: ${error.message}`
                );
            } else {
                alert(
                    "Unable to delete product."
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
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    deleteCategory,
    getCategoryProductCount,
} from "../services/category-admin.service";

type DeleteCategoryButtonProps = {
    categoryId: string;
    categoryName: string;
};

export function DeleteCategoryButton({
    categoryId,
    categoryName,
}: DeleteCategoryButtonProps) {
    const router = useRouter();

    const [isDeleting, setIsDeleting] =
        useState(false);

    async function handleDelete() {
        try {
            setIsDeleting(true);

            const productCount =
                await getCategoryProductCount(
                    categoryId
                );

            const usageMessage =
                productCount > 0
                    ? `\n\nThis category is currently used by ${productCount} product${productCount === 1 ? "" : "s"
                    }.\n\nDeleting it will remove this tag from those products. The products themselves will NOT be deleted.`
                    : "\n\nThis category is not currently used by any products.";

            const confirmed =
                window.confirm(
                    `Are you sure you want to delete "${categoryName}"?${usageMessage}\n\nThis action cannot be undone.`
                );

            if (!confirmed) {
                return;
            }

            await deleteCategory(
                categoryId
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                alert(
                    `Unable to delete category: ${error.message}`
                );
            } else {
                alert(
                    "Unable to delete category."
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
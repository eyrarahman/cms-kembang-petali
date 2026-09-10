"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    deleteMaterial,
    getMaterialUsage,
} from "../services/material-admin.service";

type DeleteMaterialButtonProps = {
    materialId: string;
    materialName: string;
};

export function DeleteMaterialButton({
    materialId,
    materialName,
}: DeleteMaterialButtonProps) {
    const router = useRouter();

    const [isDeleting, setIsDeleting] =
        useState(false);

    async function handleDelete() {
        try {
            setIsDeleting(true);

            const usage =
                await getMaterialUsage(
                    materialId
                );

            if (usage.count > 0) {
                const productList =
                    usage.products
                        .map(
                            (product) =>
                                `• ${product.productCode} — ${product.productName}`
                        )
                        .join("\n");

                window.alert(
                    `Cannot delete "${materialName}".\n\n` +
                    `This material is currently used by ${usage.count} product recipe${usage.count === 1 ? "" : "s"
                    }:\n\n` +
                    `${productList}\n\n` +
                    `Remove this material from those recipes first.`
                );

                return;
            }

            const confirmed =
                window.confirm(
                    `Are you sure you want to delete "${materialName}"?\n\nThis action cannot be undone.`
                );

            if (!confirmed) {
                return;
            }

            await deleteMaterial(
                materialId
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                alert(
                    `Unable to delete material: ${error.message}`
                );
            } else {
                alert(
                    "Unable to delete material."
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
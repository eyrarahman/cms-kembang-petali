"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { Material } from "@/features/materials/types/material.types";
import { Product } from "@/features/products/types/product.types";

import { ProductRecipe } from "../types/recipe.types";

import {
    createRecipe,
    updateRecipe,
} from "../services/recipe-admin.service";

type RecipeFormProps = {
    product: Product;
    materials: Material[];
    mode?: "create" | "edit";
    recipe?: ProductRecipe;
};

type RecipeItemInput = {
    id: string;
    materialId: string;
    quantity: string;
};

export function RecipeForm({
    product,
    materials,
    mode = "create",
    recipe,
}: RecipeFormProps) {
    const router = useRouter();

    const [items, setItems] =
        useState<RecipeItemInput[]>(
            recipe && recipe.items.length > 0
                ? recipe.items.map(
                    (item) => ({
                        id: crypto.randomUUID(),
                        materialId:
                            item.materialId,
                        quantity: String(
                            item.quantity
                        ),
                    })
                )
                : [
                    {
                        id: crypto.randomUUID(),
                        materialId: "",
                        quantity: "",
                    },
                ]
        );

    const [laborCost, setLaborCost] =
        useState(
            recipe
                ? String(recipe.laborCost)
                : "0"
        );

    const [
        wastagePercent,
        setWastagePercent,
    ] = useState(
        recipe
            ? String(
                recipe.wastagePercent
            )
            : "0"
    );

    const [otherCost, setOtherCost] =
        useState(
            recipe
                ? String(recipe.otherCost)
                : "0"
        );

    const [
        targetMarginPercent,
        setTargetMarginPercent,
    ] = useState(
        recipe
            ? String(
                recipe.targetMarginPercent
            )
            : "30"
    );

    const [notes, setNotes] =
        useState(
            recipe?.notes ?? ""
        );

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    function addMaterialRow() {
        setItems((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                materialId: "",
                quantity: "",
            },
        ]);
    }

    function removeMaterialRow(
        itemId: string
    ) {
        setItems((current) =>
            current.filter(
                (item) =>
                    item.id !== itemId
            )
        );
    }

    function updateMaterial(
        itemId: string,
        materialId: string
    ) {
        setItems((current) =>
            current.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        materialId,
                    }
                    : item
            )
        );
    }

    function updateQuantity(
        itemId: string,
        quantity: string
    ) {
        setItems((current) =>
            current.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        quantity,
                    }
                    : item
            )
        );
    }

    function getMaterial(
        materialId: string
    ) {
        return materials.find(
            (material) =>
                material.id === materialId
        );
    }

    const materialCost =
        items.reduce(
            (total, item) => {
                const material =
                    getMaterial(
                        item.materialId
                    );

                if (!material) {
                    return total;
                }

                const quantity =
                    Number(item.quantity);

                if (quantity <= 0) {
                    return total;
                }

                return (
                    total +
                    material.unitCost *
                    quantity
                );
            },
            0
        );

    const wastage =
        Number(wastagePercent) || 0;

    const labor =
        Number(laborCost) || 0;

    const other =
        Number(otherCost) || 0;

    const targetMargin =
        Number(
            targetMarginPercent
        ) || 0;

    const wastageCost =
        materialCost *
        (wastage / 100);

    const totalCost =
        materialCost +
        wastageCost +
        labor +
        other;

    const suggestedPrice =
        targetMargin < 100
            ? totalCost /
            (1 - targetMargin / 100)
            : 0;

    const estimatedProfit =
        product.price - totalCost;

    const actualMargin =
        product.price > 0
            ? (estimatedProfit /
                product.price) *
            100
            : 0;

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setIsLoading(true);
        const formData = {
            laborCost:
                Number(laborCost),

            wastagePercent:
                Number(wastagePercent),

            otherCost:
                Number(otherCost),

            targetMarginPercent:
                Number(
                    targetMarginPercent
                ),

            notes,

            items: items.map(
                (item) => ({
                    materialId:
                        item.materialId,

                    quantity:
                        Number(item.quantity),
                })
            ),
        };

        try {
            if (
                mode === "edit" &&
                recipe
            ) {
                await updateRecipe(
                    recipe.id,
                    formData
                );
            } else {
                await createRecipe(
                    product.id,
                    formData
                );
            }

            router.push(
                "/admin/recipes"
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Unable to create recipe."
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
            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <p className="text-sm font-medium text-rose-500">
                    {product.productCode}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {product.name}
                </h2>

                <p className="mt-2 text-gray-500">
                    Current Selling Price:{" "}
                    <span className="font-semibold text-gray-900">
                        RM{" "}
                        {product.price.toFixed(
                            2
                        )}
                    </span>
                </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Materials
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Add the materials used to
                            produce one unit of this
                            product.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={addMaterialRow}
                        className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
                    >
                        + Add Material
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {items.map(
                        (item, index) => {
                            const material =
                                getMaterial(
                                    item.materialId
                                );

                            const quantity =
                                Number(
                                    item.quantity
                                );

                            const lineCost =
                                material &&
                                    quantity > 0
                                    ? material.unitCost *
                                    quantity
                                    : 0;

                            return (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                                >
                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-gray-500">
                                            Material
                                        </label>

                                        <select
                                            value={
                                                item.materialId
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateMaterial(
                                                    item.id,
                                                    event.target
                                                        .value
                                                )
                                            }
                                            required
                                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-rose-400"
                                        >
                                            <option value="">
                                                Select material
                                            </option>

                                            {materials.map(
                                                (option) => {
                                                    const usedByAnotherRow =
                                                        items.some(
                                                            (
                                                                existingItem
                                                            ) =>
                                                                existingItem.id !==
                                                                item.id &&
                                                                existingItem.materialId ===
                                                                option.id
                                                        );

                                                    return (
                                                        <option
                                                            key={
                                                                option.id
                                                            }
                                                            value={
                                                                option.id
                                                            }
                                                            disabled={
                                                                usedByAnotherRow
                                                            }
                                                        >
                                                            {
                                                                option.name
                                                            }{" "}
                                                            (
                                                            {
                                                                option.materialCode
                                                            }
                                                            )
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-gray-500">
                                            Quantity
                                        </label>

                                        <input
                                            type="number"
                                            min="0.001"
                                            step="0.001"
                                            value={
                                                item.quantity
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateQuantity(
                                                    item.id,
                                                    event.target
                                                        .value
                                                )
                                            }
                                            required
                                            placeholder="0"
                                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-rose-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-gray-500">
                                            Unit Cost
                                        </label>

                                        <div className="py-2.5 text-sm text-gray-700">
                                            {material ? (
                                                <>
                                                    RM{" "}
                                                    {material.unitCost.toFixed(
                                                        2
                                                    )}
                                                    <span className="ml-1 text-xs text-gray-400">
                                                        /{" "}
                                                        {
                                                            material.baseUnit
                                                        }
                                                    </span>
                                                </>
                                            ) : (
                                                "—"
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-gray-500">
                                            Cost
                                        </label>

                                        <div className="py-2.5 font-semibold text-gray-900">
                                            RM{" "}
                                            {lineCost.toFixed(
                                                2
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeMaterialRow(
                                                    item.id
                                                )
                                            }
                                            disabled={
                                                items.length ===
                                                1
                                            }
                                            className="rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Additional Cost
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Labor Cost (RM)
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={laborCost}
                            onChange={(event) =>
                                setLaborCost(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Wastage (%)
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={
                                wastagePercent
                            }
                            onChange={(event) =>
                                setWastagePercent(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Other Cost (RM)
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={otherCost}
                            onChange={(event) =>
                                setOtherCost(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Target Margin (%)
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="99.99"
                            step="0.01"
                            value={
                                targetMarginPercent
                            }
                            onChange={(event) =>
                                setTargetMarginPercent(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Notes
                    </label>

                    <textarea
                        rows={4}
                        value={notes}
                        onChange={(event) =>
                            setNotes(
                                event.target.value
                            )
                        }
                        placeholder="Optional recipe notes..."
                        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                    />
                </div>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Cost Summary
                </h2>

                <div className="mt-6 space-y-3">
                    <SummaryRow
                        label="Material Cost"
                        value={materialCost}
                    />

                    <SummaryRow
                        label={`Wastage (${wastage.toFixed(
                            2
                        )}%)`}
                        value={wastageCost}
                    />

                    <SummaryRow
                        label="Labor Cost"
                        value={labor}
                    />

                    <SummaryRow
                        label="Other Cost"
                        value={other}
                    />

                    <div className="my-4 border-t border-gray-100" />

                    <SummaryRow
                        label="Total Cost"
                        value={totalCost}
                        strong
                    />

                    <SummaryRow
                        label={`Suggested Price (${targetMargin.toFixed(
                            2
                        )}% target margin)`}
                        value={suggestedPrice}
                        strong
                    />

                    <div className="my-4 border-t border-gray-100" />

                    <SummaryRow
                        label="Current Selling Price"
                        value={product.price}
                    />

                    <SummaryRow
                        label="Estimated Profit"
                        value={estimatedProfit}
                        strong
                    />

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            Actual Margin
                        </span>

                        <span className="font-semibold text-gray-900">
                            {actualMargin.toFixed(
                                1
                            )}
                            %
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
                            "/admin/recipes"
                        )
                    }
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Saving..."
                        : mode === "edit"
                            ? "Update Recipe"
                            : "Save Recipe"}
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
        <div className="flex items-center justify-between gap-6">
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
                RM {value.toFixed(2)}
            </span>
        </div>
    );
}
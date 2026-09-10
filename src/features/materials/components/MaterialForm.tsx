"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";
import { Material } from "../types/material.types";
import { Button } from "@/components/ui/Button";

import {
    createMaterial,
    updateMaterial,
} from "../services/material-admin.service";
import {
    MaterialCategory,
    MaterialStatus,
} from "../types/material.types";

type MaterialFormProps = {
    mode?: "create" | "edit";
    material?: Material;
};

export function MaterialForm({
    mode = "create",
    material,
}: MaterialFormProps) {


    const router = useRouter();

    const [name, setName] =
        useState(
            material?.name ?? ""
        );
    const [category, setCategory] =
        useState<MaterialCategory>(
            material?.category ?? "flower"
        );

    const [
        purchasePrice,
        setPurchasePrice,
    ] = useState(
        material
            ? String(material.purchasePrice)
            : ""
    );

    const [
        purchaseQuantity,
        setPurchaseQuantity,
    ] = useState(
        material
            ? String(
                material.purchaseQuantity
            )
            : ""
    );

    const [baseUnit, setBaseUnit] =
        useState(
            material?.baseUnit ?? ""
        );

    const [status, setStatus] =
        useState<MaterialStatus>(
            material?.status ?? "active"
        );
    const [notes, setNotes] =
        useState(
            material?.notes ?? ""
        );

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const price =
        Number(purchasePrice);

    const quantity =
        Number(purchaseQuantity);

    const unitCost =
        quantity > 0
            ? price / quantity
            : 0;

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const formData = {
                name,
                category,
                purchasePrice:
                    Number(purchasePrice),
                purchaseQuantity:
                    Number(purchaseQuantity),
                baseUnit,
                status,
                notes,
            };

            if (
                mode === "edit" &&
                material
            ) {
                await updateMaterial(
                    material.id,
                    formData
                );
            } else {
                await createMaterial(
                    formData
                );
            }

            router.push(
                "/admin/materials"
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Unable to create material."
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
                <h2 className="text-lg font-semibold text-gray-900">
                    Material Information
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Material Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            required
                            placeholder="Example: Satin Ribbon Pink"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target
                                        .value as MaterialCategory
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        >
                            <option value="flower">
                                Flower
                            </option>

                            <option value="wrapping">
                                Wrapping
                            </option>

                            <option value="ribbon">
                                Ribbon
                            </option>

                            <option value="decoration">
                                Decoration
                            </option>

                            <option value="packaging">
                                Packaging
                            </option>

                            <option value="gift">
                                Gift
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <label
                            htmlFor="purchasePrice"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Purchase Price (RM)
                        </label>

                        <input
                            id="purchasePrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={purchasePrice}
                            onChange={(event) =>
                                setPurchasePrice(
                                    event.target.value
                                )
                            }
                            required
                            placeholder="12.00"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="purchaseQuantity"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Purchase Quantity
                        </label>

                        <input
                            id="purchaseQuantity"
                            type="number"
                            min="0.001"
                            step="0.001"
                            value={purchaseQuantity}
                            onChange={(event) =>
                                setPurchaseQuantity(
                                    event.target.value
                                )
                            }
                            required
                            placeholder="25"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="baseUnit"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Base Unit
                        </label>

                        <input
                            id="baseUnit"
                            type="text"
                            value={baseUnit}
                            onChange={(event) =>
                                setBaseUnit(
                                    event.target.value
                                )
                            }
                            required
                            placeholder="meter, stem, piece..."
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                        />
                    </div>
                </div>

                <div className="mt-6 rounded-xl bg-rose-50 p-5">
                    <p className="text-sm font-medium text-gray-600">
                        Calculated Unit Cost
                    </p>

                    <p className="mt-2 text-2xl font-bold text-rose-500">
                        RM {unitCost.toFixed(2)}
                        {baseUnit && (
                            <span className="ml-2 text-sm font-normal text-gray-500">
                                / {baseUnit}
                            </span>
                        )}
                    </p>

                    {price > 0 &&
                        quantity > 0 && (
                            <p className="mt-2 text-xs text-gray-500">
                                RM{" "}
                                {price.toFixed(2)} ÷{" "}
                                {quantity}{" "}
                                {baseUnit ||
                                    "unit"}
                            </p>
                        )}
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="status"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target
                                    .value as MaterialStatus
                            )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400 md:max-w-sm"
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="notes"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Notes
                    </label>

                    <textarea
                        id="notes"
                        rows={4}
                        value={notes}
                        onChange={(event) =>
                            setNotes(
                                event.target.value
                            )
                        }
                        placeholder="Optional notes..."
                        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                    />
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
                            "/admin/materials"
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
                            ? "Update Material"
                            : "Save Material"}
                </Button>
            </div>
        </form>
    );
}
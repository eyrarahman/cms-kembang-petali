"use client";
import Link from "next/link";

import {
    FormEvent,
    useState,
    useEffect
} from "react";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { Material } from "@/features/materials/types/material.types";
import { Product } from "@/features/products/types/product.types";

import { ProductRecipe } from "../types/recipe.types";

import {
    createRecipe,
    updateRecipe,
} from "../services/recipe-admin.service";

import { Category } from "@/features/categories/types/category.types";

type RecipeFormProps = {
    product?: Product;
    materials: Material[];
    categories: Category[];
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
    categories,
    mode = "create",
    recipe,
}: RecipeFormProps) {
    const router = useRouter();

    const [recipeName, setRecipeName] =
        useState(
            recipe?.name ??
            product?.name ??
            ""
        );

    const [
        selectedCategoryIds,
        setSelectedCategoryIds,
    ] = useState<string[]>([]);

    const [
        referenceImage,
        setReferenceImage,
    ] = useState<File | undefined>();

    const [
        referenceImagePreview,
        setReferenceImagePreview,
    ] = useState<string | null>(
        null
    );

    const [existingReferenceImageUrl, setExistingReferenceImageUrl] =
        useState<string | null>(null);

    const [
        sellingPricePreview,
        setSellingPricePreview,
    ] = useState(
        product
            ? String(product.price)
            : ""
    );

    const isLinkedToProduct =
        Boolean(recipe?.productId);

    const [addToProduct, setAddToProduct] =
        useState(false);

    const [
        productName,
        setProductName,
    ] = useState(
        product?.name ??
        recipe?.name ??
        ""
    );

    const [
        productSlug,
        setProductSlug,
    ] = useState(
        product?.slug ?? ""
    );

    const [
        productSellingPrice,
        setProductSellingPrice,
    ] = useState(
        product
            ? String(product.price)
            : ""
    );

    const [
        productStatus,
        setProductStatus,
    ] = useState<
        | "available"
        | "pre_order"
        | "sold_out"
        | "hidden"
    >(
        product?.status ??
        "available"
    );

    const [
        productFeatured,
        setProductFeatured,
    ] = useState(
        product?.featured ?? false
    );

    const [
        productImageMode,
        setProductImageMode,
    ] = useState<
        "main" |
        "gallery" |
        "none"
    >("main");

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
                : []
        );

    const [
        materialSearch,
        setMaterialSearch,
    ] = useState("");

    const [
        selectedMaterialId,
        setSelectedMaterialId,
    ] = useState("");

    const [
        selectedQuantity,
        setSelectedQuantity,
    ] = useState("");

    const [
        showMaterialDropdown,
        setShowMaterialDropdown,
    ] = useState(false);


    const filteredMaterials =
        materials.filter((material) => {
            const search =
                materialSearch
                    .trim()
                    .toLowerCase();

            if (!search) {
                return true;
            }

            return (
                material.name
                    .toLowerCase()
                    .includes(search) ||
                (material.materialCode ?? "")
                    .toLowerCase()
                    .includes(search)
            );
        });



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
            : "0"
    );

    const [notes, setNotes] =
        useState(
            recipe?.notes ?? ""
        );

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    function addSelectedMaterial() {
        if (!selectedMaterialId) {
            setError(
                "Please select a material."
            );
            return;
        }

        const quantity =
            Number(selectedQuantity);

        if (
            !quantity ||
            quantity <= 0
        ) {
            setError(
                "Please enter a valid quantity."
            );
            return;
        }

        setItems((current) => {
            const existing =
                current.find(
                    (item) =>
                        item.materialId ===
                        selectedMaterialId
                );

            if (existing) {
                return current.map(
                    (item) =>
                        item.materialId ===
                            selectedMaterialId
                            ? {
                                ...item,
                                quantity: String(
                                    Number(
                                        item.quantity
                                    ) +
                                    quantity
                                ),
                            }
                            : item
                );
            }

            return [
                ...current,
                {
                    id: crypto.randomUUID(),
                    materialId:
                        selectedMaterialId,
                    quantity:
                        String(quantity),
                },
            ];
        });

        setSelectedMaterialId("");
        setSelectedQuantity("");
        setMaterialSearch("");
        setShowMaterialDropdown(false);
        setError("");
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

    function toggleCategory(
        categoryId: string
    ) {
        setSelectedCategoryIds(
            (current) =>
                current.includes(
                    categoryId
                )
                    ? current.filter(
                        (id) =>
                            id !==
                            categoryId
                    )
                    : [
                        ...current,
                        categoryId,
                    ]
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

    const previewPrice =
        Number(sellingPricePreview) || 0;

    const estimatedProfit =
        previewPrice > 0
            ? previewPrice - totalCost
            : undefined;

    const actualMargin =
        previewPrice > 0 &&
            estimatedProfit !== undefined
            ? (
                estimatedProfit /
                previewPrice
            ) * 100
            : undefined;

    useEffect(() => {
        if (!referenceImage) {
            setTimeout(() => {
                setReferenceImagePreview(
                    null
                );
            }, 0);
            return;
        }

        const objectUrl =
            URL.createObjectURL(
                referenceImage
            );

        setTimeout(() => {
            setReferenceImagePreview(
                objectUrl
            );
        }, 0);

        return () => {
            URL.revokeObjectURL(
                objectUrl
            );
        };
    }, [referenceImage]);

    useEffect(() => {
        if (
            !recipe?.referenceImagePath ||
            referenceImage
        ) {
            setTimeout(() => {
                setExistingReferenceImageUrl(
                    null
                );
            }, 0);
            return;
        }

        const supabase =
            createClient();

        const {
            data,
        } = supabase.storage
            .from("product-images")
            .getPublicUrl(
                recipe.referenceImagePath
            );

        setTimeout(() => {
            setExistingReferenceImageUrl(
                data.publicUrl
            );
        }, 0);
    }, [
        recipe?.referenceImagePath,
        referenceImage,
    ]);

    function generateSlug(
        value: string
    ) {
        return value
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9\s-]/g,
                ""
            )
            .replace(
                /\s+/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        if (isLoading) {
            return;
        }

        setError("");
        setIsLoading(true);
        const laborValue =
            Number(laborCost);

        const wastageValue =
            Number(wastagePercent);

        const otherValue =
            Number(otherCost);

        const targetMarginValue =
            Number(targetMarginPercent);

        const productSellingPriceValue =
            Number(productSellingPrice);

        if (
            Number.isNaN(laborValue) ||
            laborValue < 0
        ) {
            setError(
                "Please enter a valid labor cost."
            );
            setIsLoading(false);
            return;
        }

        if (
            Number.isNaN(wastageValue) ||
            wastageValue < 0 ||
            wastageValue > 100
        ) {
            setError(
                "Wastage must be between 0 and 100%."
            );
            setIsLoading(false);
            return;
        }

        if (
            Number.isNaN(otherValue) ||
            otherValue < 0
        ) {
            setError(
                "Please enter a valid other cost."
            );
            setIsLoading(false);
            return;
        }

        if (
            Number.isNaN(targetMarginValue) ||
            targetMarginValue < 0 ||
            targetMarginValue >= 100
        ) {
            setError(
                "Target margin must be between 0 and less than 100%."
            );
            setIsLoading(false);
            return;
        }

        if (
            addToProduct &&
            (
                Number.isNaN(
                    productSellingPriceValue
                ) ||
                productSellingPriceValue < 0
            )
        ) {
            setError(
                "Please enter a valid product selling price."
            );
            setIsLoading(false);
            return;
        }

        const formData = {
            name:
                recipeName,

            referenceImage,

            sellingPricePreview:
                previewPrice > 0
                    ? previewPrice
                    : undefined,

            existingReferenceImagePath:
                recipe?.referenceImagePath,

            laborCost:
                laborValue,

            wastagePercent:
                wastageValue,

            otherCost:
                otherValue,

            targetMarginPercent:
                targetMarginValue,
            notes,

            items: items.map(
                (item) => ({
                    materialId:
                        item.materialId,

                    quantity:
                        Number(
                            item.quantity
                        ),
                })
            ),

            addToProduct,

            product: addToProduct
                ? {
                    name:
                        productName.trim(),

                    slug:
                        productSlug.trim(),

                    sellingPrice:
                        productSellingPriceValue,

                    status:
                        productStatus,

                    featured:
                        productFeatured,

                    categoryIds:
                        selectedCategoryIds,

                    imageMode:
                        productImageMode,
                }
                : undefined,
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
                <h2 className="text-lg font-semibold text-gray-900">
                    Recipe Information
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Recipe / Costing Name
                        </label>

                        <input
                            type="text"
                            value={recipeName}
                            onChange={(event) =>
                                setRecipeName(
                                    event.target.value
                                )
                            }
                            required
                            placeholder="e.g. Pink Tulip Bouquet"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Selling Price Preview (RM)
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                sellingPricePreview
                            }
                            onChange={(event) =>
                                setSellingPricePreview(
                                    event.target.value
                                )
                            }
                            placeholder="Optional"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                            Optional. Used only to estimate
                            profit and actual margin.
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Reference Image
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Add one image as a visual
                        reference for this recipe.
                    </p>
                </div>

                <div className="mt-6">
                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-gray-700">
                            Recipe Image
                        </span>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                                const file =
                                    event.target.files?.[0];

                                if (!file) {
                                    return;
                                }

                                const allowedTypes = [
                                    "image/jpeg",
                                    "image/png",
                                    "image/webp",
                                ];

                                if (
                                    !allowedTypes.includes(
                                        file.type
                                    )
                                ) {
                                    setError(
                                        "Please upload a JPG, PNG, or WEBP image."
                                    );

                                    event.target.value = "";
                                    return;
                                }

                                const maxSize =
                                    5 * 1024 * 1024;

                                if (
                                    file.size > maxSize
                                ) {
                                    setError(
                                        "Image size must be 5MB or smaller."
                                    );

                                    event.target.value = "";
                                    return;
                                }

                                setError("");
                                setReferenceImage(
                                    file
                                );
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-rose-50 file:px-4 file:py-3 file:font-medium file:text-rose-600 hover:file:bg-rose-100"
                        />
                    </label>

                    {referenceImagePreview && (
                        <div className="mt-5">
                            <p className="mb-2 text-xs font-medium text-gray-500">
                                Preview
                            </p>

                            <div className="relative h-52 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                                <img
                                    src={
                                        referenceImagePreview
                                    }
                                    alt="Recipe reference preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setReferenceImage(
                                        undefined
                                    );
                                }}
                                className="mt-3 text-sm font-medium text-red-500 hover:text-red-600"
                            >
                                Remove image
                            </button>
                        </div>
                    )}

                    {!referenceImagePreview &&
                        existingReferenceImageUrl && (
                            <div className="mt-5">
                                <p className="mb-2 text-xs font-medium text-gray-500">
                                    Current Reference Image
                                </p>

                                <div className="relative h-52 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                                    <img
                                        src={
                                            existingReferenceImageUrl
                                        }
                                        alt="Current recipe reference"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <p className="mt-2 text-xs text-gray-400">
                                    Upload a new image above to replace this one.
                                </p>
                            </div>
                        )}
                </div>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Materials
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Search for a material, enter the
                        quantity used and add it to this
                        recipe.
                    </p>
                </div>

                <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_180px_auto]">
                        <div className="relative">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Material
                            </label>

                            <input
                                type="text"
                                value={
                                    materialSearch
                                }
                                onChange={(
                                    event
                                ) => {
                                    setMaterialSearch(
                                        event.target
                                            .value
                                    );

                                    setSelectedMaterialId(
                                        ""
                                    );

                                    setShowMaterialDropdown(
                                        true
                                    );
                                }}
                                onFocus={() =>
                                    setShowMaterialDropdown(
                                        true
                                    )
                                }
                                placeholder="Search material name or code..."
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                            />

                            {showMaterialDropdown && (
                                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                                    {filteredMaterials.length >
                                        0 ? (
                                        filteredMaterials.map(
                                            (
                                                material
                                            ) => (
                                                <button
                                                    key={
                                                        material.id
                                                    }
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedMaterialId(
                                                            material.id
                                                        );

                                                        setMaterialSearch(
                                                            material.name
                                                        );

                                                        setShowMaterialDropdown(
                                                            false
                                                        );
                                                    }}
                                                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-rose-50"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {
                                                                material.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {
                                                                material.materialCode
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-700">
                                                            RM{" "}
                                                            {material.unitCost.toFixed(
                                                                2
                                                            )}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            /{" "}
                                                            {
                                                                material.baseUnit
                                                            }
                                                        </p>
                                                    </div>
                                                </button>
                                            )
                                        )
                                    ) : (
                                        <p className="px-3 py-4 text-sm text-gray-400">
                                            No material found.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Quantity
                            </label>

                            <input
                                type="number"
                                min="0.001"
                                step="0.001"
                                value={
                                    selectedQuantity
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSelectedQuantity(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="0"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={
                                    addSelectedMaterial
                                }
                                className="w-full rounded-xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:bg-rose-600 lg:w-auto"
                            >
                                + Add
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                            Selected Materials
                        </p>

                        <p className="text-sm text-gray-500">
                            {items.length} item
                            {items.length === 1
                                ? ""
                                : "s"}
                        </p>
                    </div>

                    {items.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-gray-100 bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                                Material
                                            </th>

                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                                Cost
                                            </th>

                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                                Quantity
                                            </th>

                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                                Total
                                            </th>

                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {items.map((item) => {
                                            const material =
                                                getMaterial(
                                                    item.materialId
                                                );

                                            if (!material) {
                                                return null;
                                            }

                                            const quantity =
                                                Number(
                                                    item.quantity
                                                ) || 0;

                                            const lineCost =
                                                material.unitCost *
                                                quantity;

                                            return (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-4">
                                                        <p className="font-medium text-gray-900">
                                                            {material.name}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {material.materialCode}
                                                        </p>
                                                    </td>

                                                    <td className="px-4 py-4 text-sm text-gray-700">
                                                        RM{" "}
                                                        {material.unitCost.toFixed(
                                                            2
                                                        )}
                                                        /{material.baseUnit}
                                                    </td>

                                                    <td className="px-4 py-4">
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
                                                            className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-rose-400"
                                                        />
                                                    </td>

                                                    <td className="px-4 py-4 font-semibold text-gray-900">
                                                        RM{" "}
                                                        {lineCost.toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeMaterialRow(
                                                                    item.id
                                                                )
                                                            }
                                                            aria-label={`Delete ${material.name}`}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                                                        >
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                className="h-4 w-4"
                                                            >
                                                                <path d="M3 6h18" />
                                                                <path d="M8 6V4h8v2" />
                                                                <path d="M19 6l-1 14H6L5 6" />
                                                                <path d="M10 11v5" />
                                                                <path d="M14 11v5" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-4">
                                <span className="text-sm font-medium text-gray-600">
                                    Total Material Cost
                                </span>

                                <span className="text-lg font-bold text-rose-500">
                                    RM{" "}
                                    {materialCost.toFixed(
                                        2
                                    )}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                            <p className="text-sm font-medium text-gray-500">
                                No materials added yet.
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Search and add a
                                material above.
                            </p>
                        </div>
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

                    {previewPrice > 0 && (
                        <>
                            <div className="my-4 border-t border-gray-100" />

                            <SummaryRow
                                label="Selling Price Preview"
                                value={previewPrice}
                            />

                            <SummaryRow
                                label="Estimated Profit"
                                value={
                                    estimatedProfit ?? 0
                                }
                                strong
                            />

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Actual Margin
                                </span>

                                <span className="font-semibold text-gray-900">
                                    {actualMargin?.toFixed(
                                        1
                                    )}
                                    %
                                </span>
                            </div>
                        </>
                    )}

                </div>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                {!isLinkedToProduct && (
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={addToProduct}
                            onChange={(event) => {
                                const checked =
                                    event.target.checked;

                                setAddToProduct(
                                    checked
                                );

                                if (checked) {
                                    if (
                                        !productName.trim()
                                    ) {
                                        setProductName(
                                            recipeName
                                        );
                                    }

                                    if (
                                        !productSlug.trim()
                                    ) {
                                        setProductSlug(
                                            generateSlug(
                                                recipeName
                                            )
                                        );
                                    }

                                    if (
                                        !productSellingPrice &&
                                        sellingPricePreview
                                    ) {
                                        setProductSellingPrice(
                                            sellingPricePreview
                                        );
                                    }
                                }
                            }}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                        />

                        <div>
                            <p className="font-medium text-gray-900">
                                Add to Product List
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Create a product from this recipe.
                            </p>
                        </div>
                    </label>
                )}

                {isLinkedToProduct && product && (
                    <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                        <p className="text-sm font-semibold text-green-800">
                            Linked Product
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                            {product.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            {product.productCode}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            This recipe is already linked to a product.
                            Product information and images can be managed
                            from the Product Edit page.
                        </p>

                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="mt-4 inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm ring-1 ring-green-200 transition hover:bg-green-100"
                        >
                            Edit Product →
                        </Link>
                    </div>
                )}

                {addToProduct && !isLinkedToProduct && (
                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <h3 className="font-semibold text-gray-900">
                            Product Information
                        </h3>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        productName
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        const value =
                                            event.target
                                                .value;

                                        setProductName(
                                            value
                                        );

                                        setProductSlug(
                                            generateSlug(
                                                value
                                            )
                                        );
                                    }}
                                    required={
                                        addToProduct
                                    }
                                    placeholder="Product name"
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Slug
                                </label>

                                <input
                                    type="text"
                                    value={
                                        productSlug
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setProductSlug(
                                            generateSlug(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                    required={
                                        addToProduct
                                    }
                                    placeholder="pink-tulip-bouquet"
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Selling Price (RM)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        productSellingPrice
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setProductSellingPrice(
                                            event.target
                                                .value
                                        )
                                    }
                                    required={
                                        addToProduct
                                    }
                                    placeholder="0.00"
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                                />

                                <p className="mt-2 text-xs text-gray-400">
                                    Suggested price:
                                    {" "}
                                    RM{" "}
                                    {suggestedPrice.toFixed(
                                        2
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Status
                                </label>

                                <select
                                    value={
                                        productStatus
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setProductStatus(
                                            event.target
                                                .value as
                                            | "available"
                                            | "pre_order"
                                            | "sold_out"
                                            | "hidden"
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                                >
                                    <option value="available">
                                        Available
                                    </option>

                                    <option value="pre_order">
                                        Pre-order
                                    </option>

                                    <option value="sold_out">
                                        Sold Out
                                    </option>

                                    <option value="hidden">
                                        Hidden
                                    </option>
                                </select>
                            </div>
                        </div>

                        <label className="mt-5 flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    productFeatured
                                }
                                onChange={(
                                    event
                                ) =>
                                    setProductFeatured(
                                        event.target
                                            .checked
                                    )
                                }
                                className="h-4 w-4 accent-rose-500"
                            />

                            <span className="text-sm font-medium text-gray-700">
                                Featured product
                            </span>
                        </label>

                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-700">
                                Categories
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Select all categories that
                                apply to this product.
                            </p>

                            <div className="mt-4 space-y-5">
                                {[
                                    {
                                        type: "occasion",
                                        label: "Occasion",
                                    },
                                    {
                                        type: "flower",
                                        label: "Flower",
                                    },
                                    {
                                        type: "product_type",
                                        label: "Product Type",
                                    },
                                    {
                                        type: "color",
                                        label: "Color",
                                    },
                                ].map((group) => {
                                    const groupCategories =
                                        categories.filter(
                                            (category) =>
                                                category.type ===
                                                group.type
                                        );

                                    if (
                                        groupCategories.length ===
                                        0
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={
                                                group.type
                                            }
                                        >
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                {
                                                    group.label
                                                }
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {groupCategories.map(
                                                    (
                                                        category
                                                    ) => {
                                                        const selected =
                                                            selectedCategoryIds.includes(
                                                                category.id
                                                            );

                                                        return (
                                                            <button
                                                                key={
                                                                    category.id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleCategory(
                                                                        category.id
                                                                    )
                                                                }
                                                                className={
                                                                    selected
                                                                        ? "rounded-full border border-rose-500 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600"
                                                                        : "rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                                                                }
                                                            >
                                                                {
                                                                    category.name
                                                                }
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-700">
                                Reference Image
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Choose how the recipe
                                reference image should
                                be used for this product.
                            </p>

                            <div className="mt-3 space-y-3">
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="radio"
                                        name="productImageMode"
                                        value="main"
                                        checked={
                                            productImageMode ===
                                            "main"
                                        }
                                        onChange={() =>
                                            setProductImageMode(
                                                "main"
                                            )
                                        }
                                        className="accent-rose-500"
                                    />

                                    <span className="text-sm text-gray-700">
                                        Use as main image
                                    </span>
                                </label>

                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="radio"
                                        name="productImageMode"
                                        value="gallery"
                                        checked={
                                            productImageMode ===
                                            "gallery"
                                        }
                                        onChange={() =>
                                            setProductImageMode(
                                                "gallery"
                                            )
                                        }
                                        className="accent-rose-500"
                                    />

                                    <span className="text-sm text-gray-700">
                                        Add to product
                                        gallery only
                                    </span>
                                </label>

                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="radio"
                                        name="productImageMode"
                                        value="none"
                                        checked={
                                            productImageMode ===
                                            "none"
                                        }
                                        onChange={() =>
                                            setProductImageMode(
                                                "none"
                                            )
                                        }
                                        className="accent-rose-500"
                                    />

                                    <span className="text-sm text-gray-700">
                                        Do not add image
                                        to product
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
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
                    disabled={isLoading}
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


"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Category } from "@/features/categories/types/category.types";

import { createProduct } from "../services/product-admin.service";
import { ProductStatus } from "../types/product.types";
import { generateSlug } from "../utils/product.utils";
import { ProductImageUploader } from "./ProductImageUploader";
import { PendingProductImage } from "../types/product-image-upload.types";

type ProductFormProps = {
    categories: Category[];
};

export function ProductForm({
    categories,
}: ProductFormProps) {
    const router = useRouter();

    const [images, setImages] =
        useState<PendingProductImage[]>([]);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] =
        useState("");

    const [sellingPrice, setSellingPrice] =
        useState("");

    const [status, setStatus] =
        useState<ProductStatus>("available");

    const [featured, setFeatured] =
        useState(false);

    const [categoryIds, setCategoryIds] =
        useState<string[]>([]);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const occasionCategories =
        categories.filter(
            (category) =>
                category.type === "occasion"
        );

    const flowerCategories =
        categories.filter(
            (category) =>
                category.type === "flower"
        );

    const productTypeCategories =
        categories.filter(
            (category) =>
                category.type === "product_type"
        );

    const colorCategories =
        categories.filter(
            (category) =>
                category.type === "color"
        );

    function handleNameChange(
        value: string
    ) {
        setName(value);
        setSlug(generateSlug(value));
    }

    function handleCategoryToggle(
        categoryId: string
    ) {
        setCategoryIds((current) => {
            if (
                current.includes(categoryId)
            ) {
                return current.filter(
                    (id) => id !== categoryId
                );
            }

            return [
                ...current,
                categoryId,
            ];
        });
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            await createProduct({
                name,
                slug,
                description,
                sellingPrice:
                    Number(sellingPrice),
                status,
                featured,
                categoryIds,
                images,
            });

            router.push(
                "/admin/products"
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Unable to create product."
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
                    Product Information
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Product Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                handleNameChange(
                                    event.target.value
                                )
                            }
                            required
                            placeholder="Example: Pink Tulip Bouquet"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="slug"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Slug
                        </label>

                        <input
                            id="slug"
                            type="text"
                            value={slug}
                            onChange={(event) =>
                                setSlug(
                                    generateSlug(
                                        event.target.value
                                    )
                                )
                            }
                            required
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                            Product URL: /product/
                            {slug || "product-name"}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }
                        rows={5}
                        placeholder="Product description..."
                        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="price"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Selling Price (RM)
                        </label>

                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={sellingPrice}
                            onChange={(event) =>
                                setSellingPrice(
                                    event.target.value
                                )
                            }
                            required
                            placeholder="0.00"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
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
                                        .value as ProductStatus
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

                <label className="mt-6 flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        checked={featured}
                        onChange={(event) =>
                            setFeatured(
                                event.target.checked
                            )
                        }
                    />

                    <span className="text-sm font-medium text-gray-700">
                        Featured Product
                    </span>
                </label>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <ProductImageUploader
                    images={images}
                    onChange={setImages}
                />
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Product Tags
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Select all categories that
                    apply to this product.
                </p>

                <CategoryGroup
                    title="Occasion"
                    categories={
                        occasionCategories
                    }
                    selectedIds={categoryIds}
                    onToggle={
                        handleCategoryToggle
                    }
                />

                <CategoryGroup
                    title="Flower"
                    categories={
                        flowerCategories
                    }
                    selectedIds={categoryIds}
                    onToggle={
                        handleCategoryToggle
                    }
                />

                <CategoryGroup
                    title="Product Type"
                    categories={
                        productTypeCategories
                    }
                    selectedIds={categoryIds}
                    onToggle={
                        handleCategoryToggle
                    }
                />

                <CategoryGroup
                    title="Colour"
                    categories={
                        colorCategories
                    }
                    selectedIds={categoryIds}
                    onToggle={
                        handleCategoryToggle
                    }
                />
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
                            "/admin/products"
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
                        : "Save Product"}
                </Button>
            </div>
        </form>
    );
}

type CategoryGroupProps = {
    title: string;
    categories: Category[];
    selectedIds: string[];
    onToggle: (
        categoryId: string
    ) => void;
};

function CategoryGroup({
    title,
    categories,
    selectedIds,
    onToggle,
}: CategoryGroupProps) {
    return (
        <div className="mt-7">
            <h3 className="text-sm font-semibold text-gray-800">
                {title}
            </h3>

            <div className="mt-3 flex flex-wrap gap-3">
                {categories.map(
                    (category) => {
                        const isSelected =
                            selectedIds.includes(
                                category.id
                            );

                        return (
                            <label
                                key={category.id}
                                className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${isSelected
                                    ? "border-rose-400 bg-rose-50 text-rose-600"
                                    : "border-gray-200 bg-white text-gray-600"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                        onToggle(
                                            category.id
                                        )
                                    }
                                    className="sr-only"
                                />

                                {category.name}
                            </label>
                        );
                    }
                )}
            </div>
        </div>
    );
}
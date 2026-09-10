"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { createCategory, updateCategory } from "../services/category-admin.service";
import { Category } from "../types/category.types";
import { generateCategorySlug } from "../utils/category.utils";


type CategoryFormProps = {
    mode?: "create" | "edit";
    category?: Category;
};

export function CategoryForm({
    mode = "create",
    category,
}: CategoryFormProps) {

    const router = useRouter();

    const [name, setName] =
        useState(
            category?.name ?? ""
        );

    const [slug, setSlug] =
        useState(
            category?.slug ?? ""
        );

    const [type, setType] =
        useState<Category["type"]>(
            category?.type ?? "occasion"
        );

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    function handleNameChange(
        value: string
    ) {
        setName(value);

        setSlug(
            generateCategorySlug(value)
        );
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            if (
                mode === "edit" &&
                category
            ) {
                await updateCategory(
                    category.id,
                    {
                        name,
                        slug,
                        type,
                    }
                );
            } else {
                await createCategory({
                    name,
                    slug,
                    type,
                });
            }

            router.push(
                "/admin/categories"
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Unable to create category."
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
                    Category Information
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Category Name
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
                            placeholder="Example: Crochet Flower"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="type"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Category Type
                        </label>

                        <select
                            id="type"
                            value={type}
                            onChange={(event) =>
                                setType(
                                    event.target
                                        .value as Category["type"]
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                        >
                            <option value="occasion">
                                Occasion
                            </option>

                            <option value="flower">
                                Flower
                            </option>

                            <option value="product_type">
                                Product Type
                            </option>

                            <option value="color">
                                Colour
                            </option>
                        </select>
                    </div>
                </div>

                <div className="mt-6">
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
                                generateCategorySlug(
                                    event.target.value
                                )
                            )
                        }
                        required
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    />

                    <p className="mt-2 text-xs text-gray-400">
                        Category URL: /category/
                        {slug || "category-name"}
                    </p>
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
                            "/admin/categories"
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
                            ? "Update Category"
                            : "Save Category"}
                </Button>
            </div>
        </form>
    );
}
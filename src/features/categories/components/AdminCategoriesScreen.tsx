import Link from "next/link";

import { Category } from "../types/category.types";

type AdminCategoriesScreenProps = {
    categories: Category[];
};

import { DeleteCategoryButton } from "./DeleteCategoryButton";

const categoryTypes = [
    {
        type: "occasion",
        title: "Occasion",
        description:
            "Graduation, Birthday, Anniversary and other occasions.",
    },
    {
        type: "flower",
        title: "Flower",
        description:
            "Tulip, Sunflower, Rose and other flower types.",
    },
    {
        type: "product_type",
        title: "Product Type",
        description:
            "Bouquet, Gift Box, Chocolate Set and other product types.",
    },
    {
        type: "color",
        title: "Colour",
        description:
            "Pink, Yellow, White, Red and other colours.",
    },
] as const;

export function AdminCategoriesScreen({
    categories,
}: AdminCategoriesScreenProps) {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            Catalog Management
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900">
                            Categories
                        </h1>

                        <p className="mt-3 text-gray-600">
                            Manage product tags used for catalog filtering.
                        </p>
                    </div>

                    <Link
                        href="/admin/categories/new"
                        className="shrink-0 rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600"
                    >
                        + Add Category
                    </Link>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {categoryTypes.map((group) => {
                        const groupCategories =
                            categories.filter(
                                (category) =>
                                    category.type === group.type
                            );

                        return (
                            <section
                                key={group.type}
                                className="rounded-2xl border border-rose-100 bg-white p-6"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {group.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {group.description}
                                    </p>
                                </div>

                                <div className="mt-6 divide-y divide-gray-100">
                                    {groupCategories.map(
                                        (category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center justify-between gap-4 py-4"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {category.name}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-400">
                                                        {category.slug}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Link
                                                        href={`/admin/categories/${category.id}/edit`}
                                                        className="text-sm font-medium text-rose-500 hover:text-rose-600"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <DeleteCategoryButton
                                                        categoryId={category.id}
                                                        categoryName={category.name}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}

                                    {groupCategories.length ===
                                        0 && (
                                            <div className="py-6 text-sm text-gray-400">
                                                No categories found.
                                            </div>
                                        )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
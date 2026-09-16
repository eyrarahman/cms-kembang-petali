import Link from "next/link";

import { ProductRecipeSummary } from "../types/recipe.types";

type AdminRecipesScreenProps = {
    products: ProductRecipeSummary[];
};

export function AdminRecipesScreen({
    products,
}: AdminRecipesScreenProps) {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            Costing
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900">
                            Product Recipes
                        </h1>

                        <p className="mt-3 text-gray-600">
                            Manage recipe costing,
                            materials and suggested
                            selling prices.
                        </p>
                    </div>

                    <Link
                        href="/admin/recipes/new"
                        className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                        + Create Recipe
                    </Link>
                </div>

                <div className="mt-10 overflow-hidden rounded-2xl border border-rose-100 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-100 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Recipe
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Product
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Est. Cost
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Suggested Price
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Selling Price
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Margin
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {products.map(
                                    (recipe) => (
                                        <tr
                                            key={
                                                recipe.id
                                            }
                                        >
                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        recipe.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {recipe.productId
                                                        ? "Linked to product"
                                                        : "Standalone costing"}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                {recipe.productId ? (
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {
                                                                recipe.productName
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {
                                                                recipe.productCode
                                                            }
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">
                                                        Not linked
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-gray-900">
                                                    RM{" "}
                                                    {recipe.totalCost.toFixed(
                                                        2
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    Materials RM{" "}
                                                    {recipe.materialCost.toFixed(
                                                        2
                                                    )}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 font-medium text-gray-900">
                                                RM{" "}
                                                {recipe.suggestedPrice.toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                {recipe.sellingPrice !==
                                                    undefined ? (
                                                    <span className="font-medium text-gray-900">
                                                        RM{" "}
                                                        {recipe.sellingPrice.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                {recipe.actualMarginPercent !==
                                                    undefined ? (
                                                    <span className="font-medium text-gray-900">
                                                        {recipe.actualMarginPercent.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={`/admin/recipes/${recipe.id}/edit`}
                                                    className="text-sm font-medium text-rose-500 hover:text-rose-600"
                                                >
                                                    Edit Recipe
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {products.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="font-medium text-gray-700">
                                No recipes found.
                            </p>

                            <p className="mt-2 text-sm text-gray-400">
                                Create your first
                                costing recipe to get
                                started.
                            </p>

                            <Link
                                href="/admin/recipes/new"
                                className="mt-5 inline-block text-sm font-medium text-rose-500 hover:text-rose-600"
                            >
                                + Create Recipe
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
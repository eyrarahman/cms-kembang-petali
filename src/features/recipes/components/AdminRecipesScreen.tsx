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
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Costing
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Product Recipes
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Manage product materials and estimate production costs.
                    </p>
                </div>

                <div className="mt-10 overflow-hidden rounded-2xl border border-rose-100 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-100 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Product
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Selling Price
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Est. Cost
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Est. Profit
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Margin
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                        Recipe
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {products.map(
                                    (product) => (
                                        <tr
                                            key={
                                                product.productId
                                            }
                                        >
                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        product.productName
                                                    }
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-gray-500">
                                                    {
                                                        product.productCode
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 font-medium text-gray-900">
                                                RM{" "}
                                                {product.sellingPrice.toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                {product.recipe ? (
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            RM{" "}
                                                            {product.recipe.totalCost.toFixed(
                                                                2
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            Materials RM{" "}
                                                            {product.recipe.materialCost.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                {product.estimatedProfit !==
                                                    undefined ? (
                                                    <span className="font-medium text-gray-900">
                                                        RM{" "}
                                                        {product.estimatedProfit.toFixed(
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
                                                {product.actualMarginPercent !==
                                                    undefined ? (
                                                    <span className="font-medium text-gray-900">
                                                        {product.actualMarginPercent.toFixed(
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
                                                {product.recipe ? (
                                                    <Link
                                                        href={`/admin/recipes/${product.productId}/edit`}
                                                        className="text-sm font-medium text-rose-500 hover:text-rose-600"
                                                    >
                                                        Edit Recipe
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/admin/recipes/${product.productId}/new`}
                                                        className="text-sm font-medium text-rose-500 hover:text-rose-600"
                                                    >
                                                        + Create Recipe
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {products.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            No products found.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
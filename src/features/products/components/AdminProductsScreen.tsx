import Link from "next/link";

import { Product } from "../types/product.types";
import Image from "next/image";
import { DeleteProductButton } from "./DeleteProductButton";

type AdminProductsScreenProps = {
    products: Product[];
};

function getStatusLabel(status: Product["status"]) {
    switch (status) {
        case "available":
            return "Available";

        case "pre_order":
            return "Pre-order";

        case "sold_out":
            return "Sold Out";

        case "hidden":
            return "Hidden";
    }
}

export function AdminProductsScreen({
    products,
}: AdminProductsScreenProps) {
    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            Catalog Management
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900">
                            Products
                        </h1>

                        <p className="mt-3 text-gray-600">
                            Manage products displayed in the Kembang Petali catalog.
                        </p>
                    </div>

                    <Link
                        href="/admin/products/new"
                        className="shrink-0 rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600"
                    >
                        + Add Product
                    </Link>
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
                                        Price
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        Featured
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-rose-50">
                                                    {product.mainImage ? (
                                                        <Image
                                                            src={product.mainImage.url}
                                                            alt={product.mainImage.altText ?? product.name}
                                                            fill
                                                            sizes="56px"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <span className="text-[10px] text-gray-400">
                                                                No image
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {product.name}
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-gray-500">
                                                        {product.productCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-gray-700">
                                            RM {product.price.toFixed(2)}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {getStatusLabel(product.status)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-sm text-gray-700">
                                            {product.featured ? "Yes" : "No"}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-4">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="text-sm font-medium text-rose-500 hover:text-rose-600"
                                                >
                                                    Edit
                                                </Link>

                                                <DeleteProductButton
                                                    productId={product.id}
                                                    productName={product.name}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {products.length === 0 && (
                        <div className="p-10 text-center text-gray-500">
                            No products found.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

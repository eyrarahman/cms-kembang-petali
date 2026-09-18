"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "../types/product.types";
import Image from "next/image";
import { DeleteProductButton } from "./DeleteProductButton";

type AdminProductsScreenProps = {
    products: Product[]; businessName: string;
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
    businessName,
}: AdminProductsScreenProps) {

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<
            | "all"
            | "available"
            | "pre_order"
            | "sold_out"
            | "hidden"
        >("all");

    const filteredProducts =
        products.filter((product) => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            const matchesSearch =
                !keyword ||
                product.name
                    .toLowerCase()
                    .includes(keyword) ||
                product.productCode
                    .toLowerCase()
                    .includes(keyword);

            const matchesStatus =
                statusFilter === "all" ||
                product.status ===
                statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
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
                            Manage products displayed in the {businessName} catalog.
                        </p>
                    </div>

                    <Link
                        href="/admin/products/new"
                        className="shrink-0 rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600"
                    >
                        + Add Product
                    </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Search Product
                        </label>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search by product name or product code..."
                            className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-900 outline-none transition focus:border-rose-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value as
                                    | "all"
                                    | "available"
                                    | "pre_order"
                                    | "sold_out"
                                    | "hidden"
                                )
                            }
                            className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-900 outline-none transition focus:border-rose-400"
                        >
                            <option value="all">
                                All Statuses
                            </option>

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
                                {filteredProducts.map((product) => (
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

                    {filteredProducts.length === 0 && (
                        <div className="p-10 text-center text-gray-500">
                            {search
                                ? "No matching products found."
                                : "No products found."}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

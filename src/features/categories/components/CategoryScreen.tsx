import Link from "next/link";

import { ProductCard } from "@/features/products/components/ProductCard";
import { Product } from "@/features/products/types/product.types";

import { Category } from "../types/category.types";

type CategoryScreenProps = {
    category: Category;
    products: Product[];
    businessName: string;
};

export function CategoryScreen({
    category,
    products, businessName
}: CategoryScreenProps) {
    return (
        <main className="min-h-screen bg-rose-50 px-6 py-20">
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/"
                    className="text-sm font-medium text-rose-500"
                >
                    ← Back to Home
                </Link>

                <div className="mt-10">
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        {category.type}
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        {category.name}
                    </h1>

                    <p className="mt-4 text-sm text-gray-500">
                        {products.length}{" "}
                        {products.length === 1
                            ? "product"
                            : "products"}{" "}
                        available
                    </p>
                </div>

                {products.length > 0 ? (
                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-12 rounded-2xl border border-rose-100 bg-white p-10 text-center">
                        <p className="font-medium text-gray-700">
                            No products available in this category yet.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            More products will be added soon.
                        </p>

                        <Link
                            href="/catalog"
                            className="mt-4 inline-block text-sm font-medium text-rose-500 hover:text-rose-600"
                        >
                            Browse Catalog →
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
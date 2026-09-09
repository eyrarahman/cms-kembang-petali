"use client";

import { Navbar } from "@/components/layout/Navbar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Category } from "@/features/categories/types/category.types";

import { useProductFilters } from "../hooks/useProductFilters";
import { Product } from "../types/product.types";
import { CatalogFilters } from "./CatalogFilters";
import { ProductCard } from "./ProductCard";

type CatalogScreenProps = {
    products: Product[];
    categories: Category[];
};

export function CatalogScreen({
    products,
    categories,
}: CatalogScreenProps) {
    const {
        searchQuery,
        setSearchQuery,

        selectedOccasion,
        setSelectedOccasion,

        selectedFlower,
        setSelectedFlower,

        selectedProductType,
        setSelectedProductType,

        selectedColor,
        setSelectedColor,

        selectedPriceRange,
        setSelectedPriceRange,

        filteredProducts,

        clearFilters,
    } = useProductFilters(products);

    const occasionCategories = categories.filter(
        (category) => category.type === "occasion"
    );

    const flowerCategories = categories.filter(
        (category) => category.type === "flower"
    );

    const productTypeCategories = categories.filter(
        (category) => category.type === "product_type"
    );

    const colorCategories = categories.filter(
        (category) => category.type === "color"
    );

    return (
        <main className="min-h-screen bg-rose-50">
            <Navbar />

            <section className="px-6 py-16">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        eyebrow="Our Collection"
                        title="Catalog"
                        description="Explore koleksi produk daripada Kembang Petali."
                    />

                    <CatalogFilters
                        searchQuery={searchQuery}

                        selectedOccasion={selectedOccasion}
                        selectedFlower={selectedFlower}
                        selectedProductType={selectedProductType}
                        selectedColor={selectedColor}
                        selectedPriceRange={selectedPriceRange}

                        occasionCategories={occasionCategories}
                        flowerCategories={flowerCategories}
                        productTypeCategories={productTypeCategories}
                        colorCategories={colorCategories}

                        onSearchChange={setSearchQuery}

                        onOccasionChange={setSelectedOccasion}
                        onFlowerChange={setSelectedFlower}
                        onProductTypeChange={setSelectedProductType}
                        onColorChange={setSelectedColor}
                        onPriceRangeChange={setSelectedPriceRange}

                        onClearFilters={clearFilters}
                    />

                    <div className="mt-8">
                        <p className="text-sm text-gray-500">
                            {filteredProducts.length} product(s) found
                        </p>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-10 text-center">
                            <p className="font-medium text-gray-700">
                                No products found.
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Cuba ubah search atau filter yang dipilih.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-4 text-sm font-medium text-rose-500"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
"use client";

import { Category } from "@/features/categories/types/category.types";

type CatalogFiltersProps = {
    searchQuery: string;

    selectedOccasion: string;
    selectedFlower: string;
    selectedProductType: string;
    selectedColor: string;

    occasionCategories: Category[];
    flowerCategories: Category[];
    productTypeCategories: Category[];
    colorCategories: Category[];

    onSearchChange: (value: string) => void;

    onOccasionChange: (value: string) => void;
    onFlowerChange: (value: string) => void;
    onProductTypeChange: (value: string) => void;
    onColorChange: (value: string) => void;

    selectedPriceRange: string;

    onPriceRangeChange: (value: string) => void;

    onClearFilters: () => void;
};

export function CatalogFilters({
    searchQuery,

    selectedOccasion,
    selectedFlower,
    selectedProductType,
    selectedColor,
    selectedPriceRange,
    onPriceRangeChange,

    occasionCategories,
    flowerCategories,
    productTypeCategories,
    colorCategories,

    onSearchChange,

    onOccasionChange,
    onFlowerChange,
    onProductTypeChange,
    onColorChange,

    onClearFilters,
}: CatalogFiltersProps) {
    return (
        <div className="mt-10 rounded-2xl border border-rose-100 bg-white p-6">
            <div>
                <label
                    htmlFor="search"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Search Product
                </label>

                <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    placeholder="Search product..."
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                    <label
                        htmlFor="occasion"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Occasion
                    </label>

                    <select
                        id="occasion"
                        value={selectedOccasion}
                        onChange={(event) =>
                            onOccasionChange(event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="all">
                            All Occasions
                        </option>

                        {occasionCategories.map((category) => (
                            <option
                                key={category.id}
                                value={category.slug}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="flower"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Flower
                    </label>

                    <select
                        id="flower"
                        value={selectedFlower}
                        onChange={(event) =>
                            onFlowerChange(event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="all">
                            All Flowers
                        </option>

                        {flowerCategories.map((category) => (
                            <option
                                key={category.id}
                                value={category.slug}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="product-type"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Product Type
                    </label>

                    <select
                        id="product-type"
                        value={selectedProductType}
                        onChange={(event) =>
                            onProductTypeChange(event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="all">
                            All Product Types
                        </option>

                        {productTypeCategories.map((category) => (
                            <option
                                key={category.id}
                                value={category.slug}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="color"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Colour
                    </label>

                    <select
                        id="color"
                        value={selectedColor}
                        onChange={(event) =>
                            onColorChange(event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="all">
                            All Colours
                        </option>

                        {colorCategories.map((category) => (
                            <option
                                key={category.id}
                                value={category.slug}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="price-range"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Price
                    </label>

                    <select
                        id="price-range"
                        value={selectedPriceRange}
                        onChange={(event) =>
                            onPriceRangeChange(event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                    >
                        <option value="all">
                            Any Price
                        </option>

                        <option value="below-50">
                            Below RM50
                        </option>

                        <option value="50-100">
                            RM50 - RM100
                        </option>

                        <option value="above-100">
                            Above RM100
                        </option>
                    </select>
                </div>
            </div>

            <div className="mt-5">
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-sm font-medium text-rose-500 hover:text-rose-600"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
}
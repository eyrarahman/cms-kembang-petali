"use client";

import { useMemo, useState } from "react";
import { Product } from "../types/product.types";

export function useProductFilters(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedOccasion, setSelectedOccasion] =
    useState("all");

  const [selectedFlower, setSelectedFlower] =
    useState("all");

  const [selectedProductType, setSelectedProductType] =
    useState("all");

  const [selectedColor, setSelectedColor] =
    useState("all");

    const [selectedPriceRange, setSelectedPriceRange] =
    useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchQuery.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.description
          ?.toLowerCase()
          .includes(search);

      const matchesOccasion =
        selectedOccasion === "all" ||
        product.categorySlugs.includes(selectedOccasion);

      const matchesFlower =
        selectedFlower === "all" ||
        product.categorySlugs.includes(selectedFlower);

      const matchesProductType =
        selectedProductType === "all" ||
        product.categorySlugs.includes(selectedProductType);

      const matchesColor =
        selectedColor === "all" ||
        product.categorySlugs.includes(selectedColor);

        const matchesPrice =
        selectedPriceRange === "all" ||
        (selectedPriceRange === "below-50" &&
          product.price < 50) ||
        (selectedPriceRange === "50-100" &&
          product.price >= 50 &&
          product.price <= 100) ||
        (selectedPriceRange === "above-100" &&
          product.price > 100);

      return (
        matchesSearch &&
        matchesOccasion &&
        matchesFlower &&
        matchesProductType &&
        matchesColor && 
        matchesPrice
      );
    });
  }, [
    products,
    searchQuery,
    selectedOccasion,
    selectedFlower,
    selectedProductType,
    selectedColor,
    selectedPriceRange,
  ]);

  function clearFilters() {
    setSearchQuery("");
    setSelectedOccasion("all");
    setSelectedFlower("all");
    setSelectedProductType("all");
    setSelectedColor("all");
    setSelectedPriceRange("all");
  }

  return {
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


  };
}

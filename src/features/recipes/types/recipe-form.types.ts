export type RecipeFormItem = {
    materialId: string;
    quantity: number;
};

export type RecipeProductImageMode =
    | "main"
    | "gallery"
    | "none";

export type RecipeProductData = {
    name: string;
    slug: string;
    sellingPrice: number;
    status:
        | "available"
        | "pre_order"
        | "sold_out"
        | "hidden";
    featured: boolean;
    categoryIds: string[];
    imageMode: RecipeProductImageMode;
};

export type RecipeFormData = {
    name: string;

    referenceImage?: File;
    existingReferenceImagePath?: string;

    laborCost: number;
    wastagePercent: number;
    otherCost: number;
    targetMarginPercent: number;

    sellingPricePreview?: number;

    notes: string;

    items: RecipeFormItem[];

    addToProduct: boolean;

    product?: RecipeProductData;
};
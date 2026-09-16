export type RecipeSummary = {
    id: string;

    name: string;

    productId?: string;
    productCode?: string;
    productName?: string;
    sellingPrice?: number;

    referenceImagePath?: string;

    laborCost: number;
    wastagePercent: number;
    otherCost: number;
    targetMarginPercent: number;

    materialCost: number;
    wastageCost: number;
    totalCost: number;
    suggestedPrice: number;

    estimatedProfit?: number;
    actualMarginPercent?: number;
};

export type ProductRecipeSummary =
    RecipeSummary;

export type RecipeItem = {
    id: string;
    materialId: string;
    quantity: number;
    sortOrder: number;
};

export type ProductRecipe = {
    id: string;

    name: string;

    productId?: string;

    referenceImagePath?: string;

    laborCost: number;
    wastagePercent: number;
    otherCost: number;
    targetMarginPercent: number;

    notes?: string;

    items: RecipeItem[];
};
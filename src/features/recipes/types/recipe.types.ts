export type RecipeSummary = {
    id: string;
    laborCost: number;
    wastagePercent: number;
    otherCost: number;
    targetMarginPercent: number;
  
    materialCost: number;
    wastageCost: number;
    totalCost: number;
    suggestedPrice: number;
  };
  
  export type ProductRecipeSummary = {
    productId: string;
    productCode: string;
    productName: string;
    sellingPrice: number;
  
    recipe?: RecipeSummary;
  
    estimatedProfit?: number;
    actualMarginPercent?: number;
  };

  export type RecipeItem = {
    id: string;
    materialId: string;
    quantity: number;
    sortOrder: number;
  };
  
  export type ProductRecipe = {
    id: string;
    laborCost: number;
    wastagePercent: number;
    otherCost: number;
    targetMarginPercent: number;
    notes?: string;
    items: RecipeItem[];
  };
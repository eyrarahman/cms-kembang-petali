export type RecipeFormItem = {
    materialId: string;
    quantity: number;
  };
  
  export type RecipeFormData = {
    laborCost: number;
    wastagePercent: number;
    otherCost: number;
    targetMarginPercent: number;
    notes: string;
    items: RecipeFormItem[];
  };
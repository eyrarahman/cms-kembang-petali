import {
    ProductRecipe,
    ProductRecipeSummary,
  } from "../types/recipe.types";

type MaterialDatabaseRow = {
  id: string;
  name: string;
  purchase_price: number;
  purchase_quantity: number;
  base_unit: string;
};

type RecipeItemDatabaseRow = {
  id: string;
  quantity: number;
  sort_order: number;

  materials:
    | MaterialDatabaseRow
    | MaterialDatabaseRow[]
    | null;
};

type RecipeDatabaseRow = {
  id: string;
  labor_cost: number;
  wastage_percent: number;
  other_cost: number;
  target_margin_percent: number;

  product_recipe_items:
    | RecipeItemDatabaseRow[]
    | null;
};

type ProductRecipeDatabaseRow = {
  id: string;
  product_code: string;
  name: string;
  selling_price: number;

  product_recipes:
    | RecipeDatabaseRow
    | RecipeDatabaseRow[]
    | null;
};

function getSingleRelation<T>(
  relation: T | T[] | null
): T | null {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

export function mapProductRecipeSummary(
  product: ProductRecipeDatabaseRow
): ProductRecipeSummary {
  const sellingPrice =
    Number(product.selling_price);

  const recipe =
    getSingleRelation(
      product.product_recipes
    );

  if (!recipe) {
    return {
      productId: product.id,
      productCode:
        product.product_code,
      productName:
        product.name,
      sellingPrice,
    };
  }

  const materialCost =
    recipe.product_recipe_items?.reduce(
      (total, item) => {
        const material =
          getSingleRelation(
            item.materials
          );

        if (!material) {
          return total;
        }

        const purchasePrice =
          Number(
            material.purchase_price
          );

        const purchaseQuantity =
          Number(
            material.purchase_quantity
          );

        if (
          purchaseQuantity <= 0
        ) {
          return total;
        }

        const unitCost =
          purchasePrice /
          purchaseQuantity;

        const itemCost =
          unitCost *
          Number(item.quantity);

        return (
          total + itemCost
        );
      },
      0
    ) ?? 0;

  const wastagePercent =
    Number(
      recipe.wastage_percent
    );

  const laborCost =
    Number(
      recipe.labor_cost
    );

  const otherCost =
    Number(
      recipe.other_cost
    );

  const targetMarginPercent =
    Number(
      recipe.target_margin_percent
    );

  const wastageCost =
    materialCost *
    (wastagePercent / 100);

  const totalCost =
    materialCost +
    wastageCost +
    laborCost +
    otherCost;

  const suggestedPrice =
    targetMarginPercent < 100
      ? totalCost /
        (1 -
          targetMarginPercent /
            100)
      : 0;

  const estimatedProfit =
    sellingPrice - totalCost;

  const actualMarginPercent =
    sellingPrice > 0
      ? (estimatedProfit /
          sellingPrice) *
        100
      : 0;

  return {
    productId:
      product.id,

    productCode:
      product.product_code,

    productName:
      product.name,

    sellingPrice,

    recipe: {
      id: recipe.id,

      laborCost,
      wastagePercent,
      otherCost,
      targetMarginPercent,

      materialCost,
      wastageCost,
      totalCost,
      suggestedPrice,
    },

    estimatedProfit,
    actualMarginPercent,
  };
}
type ProductRecipeDetailDatabaseRow = {
    id: string;
    labor_cost: number;
    wastage_percent: number;
    other_cost: number;
    target_margin_percent: number;
    notes: string | null;
  
    product_recipe_items:
      | {
          id: string;
          material_id: string;
          quantity: number;
          sort_order: number;
        }[]
      | null;
  };
  
  export function mapProductRecipeFromDatabase(
    recipe: ProductRecipeDetailDatabaseRow
  ): ProductRecipe {
    return {
      id: recipe.id,
  
      laborCost:
        Number(recipe.labor_cost),
  
      wastagePercent:
        Number(recipe.wastage_percent),
  
      otherCost:
        Number(recipe.other_cost),
  
      targetMarginPercent:
        Number(
          recipe.target_margin_percent
        ),
  
      notes:
        recipe.notes ?? undefined,
  
      items:
        recipe.product_recipe_items
          ?.map((item) => ({
            id: item.id,
            materialId:
              item.material_id,
            quantity:
              Number(item.quantity),
            sortOrder:
              item.sort_order,
          }))
          .sort(
            (a, b) =>
              a.sortOrder -
              b.sortOrder
          ) ?? [],
    };
  }
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

type ProductDatabaseRow = {
  id: string;
  product_code: string;
  name: string;
  selling_price: number;
};

type RecipeDatabaseRow = {
  id: string;
  name: string;

  product_id: string | null;
  reference_image_path: string | null;

  labor_cost: number;
  wastage_percent: number;
  other_cost: number;
  target_margin_percent: number;

  products:
  | ProductDatabaseRow
  | ProductDatabaseRow[]
  | null;

  product_recipe_items:
  | RecipeItemDatabaseRow[]
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
  recipe: RecipeDatabaseRow
): ProductRecipeSummary {
  const product =
    getSingleRelation(
      recipe.products
    );

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

        if (purchaseQuantity <= 0) {
          return total;
        }

        const unitCost =
          purchasePrice /
          purchaseQuantity;

        return (
          total +
          unitCost *
          Number(item.quantity)
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
      (
        1 -
        targetMarginPercent / 100
      )
      : 0;

  const sellingPrice =
    product
      ? Number(
        product.selling_price
      )
      : undefined;

  const estimatedProfit =
    sellingPrice !== undefined
      ? sellingPrice -
      totalCost
      : undefined;

  const actualMarginPercent =
    sellingPrice !== undefined &&
      sellingPrice > 0
      ? (
        (sellingPrice -
          totalCost) /
        sellingPrice
      ) * 100
      : undefined;

  return {
    id: recipe.id,

    name: recipe.name,

    productId:
      product?.id,

    productCode:
      product?.product_code,

    productName:
      product?.name,

    sellingPrice,

    referenceImagePath:
      recipe.reference_image_path ??
      undefined,

    laborCost,
    wastagePercent,
    otherCost,
    targetMarginPercent,

    materialCost,
    wastageCost,
    totalCost,
    suggestedPrice,

    estimatedProfit,
    actualMarginPercent,
  };
}
type ProductRecipeDetailDatabaseRow = {
  id: string;
  name: string;
  product_id: string | null;
  reference_image_path: string | null;
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

    name: recipe.name,

    productId:
      recipe.product_id ??
      undefined,

    referenceImagePath:
      recipe.reference_image_path ??
      undefined,

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
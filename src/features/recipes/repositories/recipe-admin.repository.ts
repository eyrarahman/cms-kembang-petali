import { createClient } from "@/lib/supabase/client";

import { RecipeFormData } from "../types/recipe-form.types";

export async function createRecipeInDatabase(
  productId: string,
  formData: RecipeFormData
) {
  const supabase = createClient();

  let createdRecipeId: string | null =
    null;

  try {
    const {
      data: recipe,
      error: recipeError,
    } = await supabase
      .from("product_recipes")
      .insert({
        product_id: productId,
        labor_cost:
          formData.laborCost,
        wastage_percent:
          formData.wastagePercent,
        other_cost:
          formData.otherCost,
        target_margin_percent:
          formData.targetMarginPercent,
        notes:
          formData.notes || null,
      })
      .select("id")
      .single();

    if (recipeError) {
      throw new Error(
        recipeError.message
      );
    }

    createdRecipeId = recipe.id;

    const recipeItems =
      formData.items.map(
        (item, index) => ({
          recipe_id: recipe.id,
          material_id:
            item.materialId,
          quantity:
            item.quantity,
          sort_order: index,
        })
      );

    const {
      error: itemsError,
    } = await supabase
      .from(
        "product_recipe_items"
      )
      .insert(recipeItems);

    if (itemsError) {
      throw new Error(
        itemsError.message
      );
    }

    return recipe;
  } catch (error) {
    if (createdRecipeId) {
      await supabase
        .from("product_recipes")
        .delete()
        .eq(
          "id",
          createdRecipeId
        );
    }

    throw error;
  }
}
export async function updateRecipeInDatabase(
    recipeId: string,
    formData: RecipeFormData
  ) {
    const supabase = createClient();
  
    // Update recipe information
    const { error: recipeError } =
      await supabase
        .from("product_recipes")
        .update({
          labor_cost:
            formData.laborCost,
  
          wastage_percent:
            formData.wastagePercent,
  
          other_cost:
            formData.otherCost,
  
          target_margin_percent:
            formData.targetMarginPercent,
  
          notes:
            formData.notes || null,
  
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", recipeId);
  
    if (recipeError) {
      throw new Error(
        recipeError.message
      );
    }
  
    // Remove old recipe items
    const {
      error: deleteItemsError,
    } = await supabase
      .from("product_recipe_items")
      .delete()
      .eq("recipe_id", recipeId);
  
    if (deleteItemsError) {
      throw new Error(
        deleteItemsError.message
      );
    }
  
    // Insert current items
    const recipeItems =
      formData.items.map(
        (item, index) => ({
          recipe_id: recipeId,
          material_id:
            item.materialId,
          quantity:
            item.quantity,
          sort_order: index,
        })
      );
  
    const {
      error: itemsError,
    } = await supabase
      .from(
        "product_recipe_items"
      )
      .insert(recipeItems);
  
    if (itemsError) {
      throw new Error(
        itemsError.message
      );
    }
  }
  
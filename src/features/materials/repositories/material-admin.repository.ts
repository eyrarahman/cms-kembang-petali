import { createClient } from "@/lib/supabase/client";

import { MaterialFormData } from "../types/material-form.types";

export async function createMaterialInDatabase(
  formData: MaterialFormData
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("materials")
    .insert({
      name: formData.name,
      category: formData.category,
      purchase_price: formData.purchasePrice,
      purchase_quantity: formData.purchaseQuantity,
      base_unit: formData.baseUnit,
      status: formData.status,
      notes: formData.notes || null,
    })
    .select(`
      id,
      material_code,
      name,
      category,
      purchase_price,
      purchase_quantity,
      base_unit,
      status,
      notes
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateMaterialInDatabase(
    materialId: string,
    formData: MaterialFormData
  ) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from("materials")
      .update({
        name: formData.name,
        category: formData.category,
        purchase_price:
          formData.purchasePrice,
        purchase_quantity:
          formData.purchaseQuantity,
        base_unit: formData.baseUnit,
        status: formData.status,
        notes:
          formData.notes || null,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", materialId)
      .select(`
        id,
        material_code,
        name,
        category,
        purchase_price,
        purchase_quantity,
        base_unit,
        status,
        notes
      `)
      .single();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }

  export async function deleteMaterialFromDatabase(
    materialId: string
  ) {
    const supabase = createClient();
  
    const { error } = await supabase
      .from("materials")
      .delete()
      .eq("id", materialId);
  
    if (error) {
      throw new Error(error.message);
    }
  }
  export async function getMaterialUsageFromDatabase(
    materialId: string
  ) {
    const supabase = createClient();
  
    // 1. Find recipe items using this material
    const {
      data: recipeItems,
      error: recipeItemsError,
    } = await supabase
      .from("product_recipe_items")
      .select("recipe_id")
      .eq("material_id", materialId);
  
    if (recipeItemsError) {
      throw new Error(
        recipeItemsError.message
      );
    }
  
    const recipeIds = [
      ...new Set(
        recipeItems?.map(
          (item) => item.recipe_id
        ) ?? []
      ),
    ];
  
    if (recipeIds.length === 0) {
      return {
        count: 0,
        products: [],
      };
    }
  
    // 2. Find products attached to those recipes
    const {
      data: recipes,
      error: recipesError,
    } = await supabase
      .from("product_recipes")
      .select(`
        id,
        product_id
      `)
      .in("id", recipeIds);
  
    if (recipesError) {
      throw new Error(
        recipesError.message
      );
    }
  
    const productIds = [
      ...new Set(
        recipes?.map(
          (recipe) => recipe.product_id
        ) ?? []
      ),
    ];
  
    if (productIds.length === 0) {
      return {
        count: 0,
        products: [],
      };
    }
  
    // 3. Get product information
    const {
      data: products,
      error: productsError,
    } = await supabase
      .from("products")
      .select(`
        id,
        product_code,
        name
      `)
      .in("id", productIds);
  
    if (productsError) {
      throw new Error(
        productsError.message
      );
    }
  
    return {
      count: products?.length ?? 0,
  
      products:
        products?.map(
          (product) => ({
            productId: product.id,
            productCode:
              product.product_code,
            productName:
              product.name,
          })
        ) ?? [],
    };
  }
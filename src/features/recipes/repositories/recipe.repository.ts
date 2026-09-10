import { createClient } from "@/lib/supabase/server";

export async function getProductRecipesFromDatabase() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      product_code,
      name,
      selling_price,

      product_recipes (
        id,
        labor_cost,
        wastage_percent,
        other_cost,
        target_margin_percent,

        product_recipe_items (
          id,
          quantity,
          sort_order,

          materials (
            id,
            name,
            purchase_price,
            purchase_quantity,
            base_unit
          )
        )
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
export async function getRecipeByProductIdFromDatabase(
    productId: string
  ) {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("product_recipes")
      .select(`
        id,
        labor_cost,
        wastage_percent,
        other_cost,
        target_margin_percent,
        notes,
  
        product_recipe_items (
          id,
          material_id,
          quantity,
          sort_order
        )
      `)
      .eq("product_id", productId)
      .maybeSingle();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }
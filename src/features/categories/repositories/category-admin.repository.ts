import { createClient } from "@/lib/supabase/client";

import { CategoryFormData } from "../types/category-form.types";

export async function createCategoryInDatabase(
  formData: CategoryFormData
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: formData.name,
      slug: formData.slug,
      type: formData.type,
    })
    .select(
      "id, name, slug, type"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
export async function updateCategoryInDatabase(
    categoryId: string,
    formData: CategoryFormData
  ) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from("categories")
      .update({
        name: formData.name,
        slug: formData.slug,
        type: formData.type,
      })
      .eq("id", categoryId)
      .select(
        "id, name, slug, type"
      )
      .single();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }

  export async function getCategoryProductCountFromDatabase(
    categoryId: string
  ) {
    const supabase = createClient();
  
    const { count, error } = await supabase
      .from("product_categories")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("category_id", categoryId);
  
    if (error) {
      throw new Error(error.message);
    }
  
    return count ?? 0;
  }
  
  export async function deleteCategoryFromDatabase(
    categoryId: string
  ) {
    const supabase = createClient();
  
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);
  
    if (error) {
      throw new Error(error.message);
    }
  }
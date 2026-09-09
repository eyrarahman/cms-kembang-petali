import { createClient } from "@/lib/supabase/server";

export async function getProductsFromDatabase() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      product_code,
      name,
      slug,
      description,
      selling_price,
      status,
      featured,
      product_categories (
        categories (
          slug
        )
      ),
      product_images (
        id,
        storage_path,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .neq("status", "hidden")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getProductBySlugFromDatabase(
    slug: string
  ) {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        product_code,
        name,
        slug,
        description,
        selling_price,
        status,
        featured,
        product_categories (
          categories (
            slug
          )
        ),
        product_images (
          id,
          storage_path,
          alt_text,
          is_primary,
          sort_order
        )
      `)
      .eq("slug", slug)
      .neq("status", "hidden")
      .maybeSingle();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }

  export async function getFeaturedProductsFromDatabase() {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        product_code,
        name,
        slug,
        description,
        selling_price,
        status,
        featured,
        product_categories (
          categories (
            slug
          )
        ),
        product_images (
          id,
          storage_path,
          alt_text,
          is_primary,
          sort_order
        )
      `)
      .eq("featured", true)
      .neq("status", "hidden")
      .order("created_at", {
        ascending: false,
      });
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }

  export async function getAdminProductsFromDatabase() {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        product_code,
        name,
        slug,
        description,
        selling_price,
        status,
        featured,
        product_categories (
          categories (
            slug
          )
        ),
        product_images (
          id,
          storage_path,
          alt_text,
          is_primary,
          sort_order
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

  export async function getAdminProductByIdFromDatabase(
    productId: string
  ) {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        product_code,
        name,
        slug,
        description,
        selling_price,
        status,
        featured,
        product_categories (
          categories (
            slug
          )
        ),
        product_images (
          id,
          storage_path,
          alt_text,
          is_primary,
          sort_order
        )
      `)
      .eq("id", productId)
      .maybeSingle();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }
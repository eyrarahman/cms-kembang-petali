import { createClient } from "@/lib/supabase/server";

export async function getCategoriesFromDatabase() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      type
    `)
    .order("type", {
      ascending: true,
    })
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCategoryBySlugFromDatabase(
  slug: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      type
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
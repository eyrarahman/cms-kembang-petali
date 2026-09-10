import { createClient } from "@/lib/supabase/server";

export async function getMaterialsFromDatabase() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("materials")
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
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMaterialByIdFromDatabase(
    materialId: string
  ) {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("materials")
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
      .eq("id", materialId)
      .maybeSingle();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }
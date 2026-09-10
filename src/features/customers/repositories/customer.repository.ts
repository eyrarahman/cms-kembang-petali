import { createClient } from "@/lib/supabase/server";

export async function getCustomersFromDatabase() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select(`
      id,
      customer_code,
      name,
      phone,
      email,
      notes,
      status
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCustomerByIdFromDatabase(
    customerId: string
  ) {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("customers")
      .select(`
        id,
        customer_code,
        name,
        phone,
        email,
        notes,
        status
      `)
      .eq("id", customerId)
      .maybeSingle();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }
import { createClient } from "@/lib/supabase/client";

import { CustomerFormData } from "../types/customer-form.types";

export async function createCustomerInDatabase(
  formData: CustomerFormData
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email:
        formData.email.trim() || null,
      status: formData.status,
      notes:
        formData.notes.trim() || null,
    })
    .select(`
      id,
      customer_code,
      name,
      phone,
      email,
      notes,
      status
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findCustomersByPhoneFromDatabase(
  phone: string
) {
  const supabase = createClient();

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
    .eq("phone", phone.trim())
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateCustomerInDatabase(
    customerId: string,
    formData: CustomerFormData
  ) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from("customers")
      .update({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email:
          formData.email.trim() || null,
        status: formData.status,
        notes:
          formData.notes.trim() || null,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", customerId)
      .select(`
        id,
        customer_code,
        name,
        phone,
        email,
        notes,
        status
      `)
      .single();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }
  
  export async function deleteCustomerFromDatabase(
    customerId: string
  ) {
    const supabase = createClient();
  
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId);
  
    if (error) {
      throw new Error(error.message);
    }
  }
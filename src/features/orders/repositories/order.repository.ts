import { createClient } from "@/lib/supabase/server";

export async function getOrdersFromDatabase() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_code,
      customer_id,

      recipient_name,
      recipient_phone,

      fulfillment_type,
      fulfillment_date,
      prep_days,
      production_start_date,
      fulfillment_address,
      fulfillment_fee,

      subtotal,
      discount_amount,
      total_amount,
      amount_paid,

      payment_status,
      payment_method,
      status,

      customer_notes,
      admin_notes,

      created_at,

      customers (
        customer_code,
        name,
        phone
      )
    `)
    .order("fulfillment_date", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getOrderByIdFromDatabase(
    orderId: string
  ) {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_code,
        customer_id,
  
        recipient_name,
        recipient_phone,
  
        fulfillment_type,
        fulfillment_date,
        prep_days,
        production_start_date,
        fulfillment_address,
        fulfillment_fee,
  
        subtotal,
        discount_amount,
        total_amount,
        amount_paid,
  
        payment_status,
        payment_method,
        status,
  
        customer_notes,
        admin_notes,
  
        created_at,
  
        customers (
          customer_code,
          name,
          phone
        ),
  
        order_items (
          id,
          product_id,
          product_code,
          item_name,
          quantity,
          unit_price,
          line_total,
          customization_notes,
          sort_order
        )
      `)
      .eq("id", orderId)
      .maybeSingle();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }
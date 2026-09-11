import { createClient } from "@/lib/supabase/client";

import { OrderFormData } from "../types/order-form.types";
import { calculateOrderTotals } from "../utils/order.utils";

export async function createOrderInDatabase(
  formData: OrderFormData
) {
  const supabase = createClient();

  const {
    subtotal,
    totalAmount,
    paymentStatus,
  } = calculateOrderTotals(
    formData
  );

  let createdOrderId:
    | string
    | null = null;

  try {
    // 1. Create order
    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        customer_id:
          formData.customerId,

        recipient_name:
          formData.recipientName ||
          null,

        recipient_phone:
          formData.recipientPhone ||
          null,

        fulfillment_type:
          formData.fulfillmentType,

        fulfillment_date:
          formData.fulfillmentDate,

        prep_days:
          formData.prepDays,

        fulfillment_address:
          formData.fulfillmentAddress ||
          null,

        fulfillment_fee:
          formData.fulfillmentFee,

        discount_amount:
          formData.discountAmount,

        subtotal,

        total_amount:
          totalAmount,

        amount_paid:
          formData.amountPaid,

        payment_status:
          paymentStatus,

        payment_method:
          formData.paymentMethod ??
          null,

        status:
          formData.status,

        customer_notes:
          formData.customerNotes ||
          null,

        admin_notes:
          formData.adminNotes ||
          null,
      })
      .select(
        "id, order_code"
      )
      .single();

    if (orderError) {
      throw new Error(
        orderError.message
      );
    }

    createdOrderId =
      order.id;

    // 2. Save order items
    const itemRows =
      formData.items.map(
        (item, index) => ({
          order_id:
            order.id,

          product_id:
            item.productId ??
            null,

          product_code:
            item.productCode ??
            null,

          item_name:
            item.itemName,

          quantity:
            item.quantity,

          unit_price:
            item.unitPrice,

          customization_notes:
            item.customizationNotes ||
            null,

          sort_order:
            index,
        })
      );

    const {
      error: itemError,
    } = await supabase
      .from("order_items")
      .insert(itemRows);

    if (itemError) {
      throw new Error(
        itemError.message
      );
    }

    return order;
  } catch (error) {
    if (createdOrderId) {
      await supabase
        .from("orders")
        .delete()
        .eq(
          "id",
          createdOrderId
        );
    }

    throw error;
  }
}
export async function updateOrderInDatabase(
    orderId: string,
    formData: OrderFormData
  ) {
    const supabase = createClient();
  
    const {
      subtotal,
      totalAmount,
      paymentStatus,
    } = calculateOrderTotals(
      formData
    );
  
    // 1. Update order information
    const {
      error: orderError,
    } = await supabase
      .from("orders")
      .update({
        customer_id:
          formData.customerId,
  
        recipient_name:
          formData.recipientName.trim() ||
          null,
  
        recipient_phone:
          formData.recipientPhone.trim() ||
          null,
  
        fulfillment_type:
          formData.fulfillmentType,
  
        fulfillment_date:
          formData.fulfillmentDate,
  
        prep_days:
          formData.prepDays,
  
        fulfillment_address:
          formData.fulfillmentType ===
          "pickup"
            ? null
            : formData.fulfillmentAddress.trim() ||
              null,
  
        fulfillment_fee:
          formData.fulfillmentFee,
  
        discount_amount:
          formData.discountAmount,
  
        subtotal,
  
        total_amount:
          totalAmount,
  
        amount_paid:
          formData.amountPaid,
  
        payment_status:
          paymentStatus,
  
        payment_method:
          formData.amountPaid > 0
            ? formData.paymentMethod ??
              null
            : null,
  
        status:
          formData.status,
  
        customer_notes:
          formData.customerNotes.trim() ||
          null,
  
        admin_notes:
          formData.adminNotes.trim() ||
          null,
  
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", orderId);
  
    if (orderError) {
      throw new Error(
        orderError.message
      );
    }
  
    // 2. Remove previous items
    const {
      error: deleteItemsError,
    } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", orderId);
  
    if (deleteItemsError) {
      throw new Error(
        deleteItemsError.message
      );
    }
  
    // 3. Insert latest items
    const itemRows =
      formData.items.map(
        (item, index) => ({
          order_id:
            orderId,
  
          product_id:
            item.productId ??
            null,
  
          product_code:
            item.productCode ??
            null,
  
          item_name:
            item.itemName.trim(),
  
          quantity:
            item.quantity,
  
          unit_price:
            item.unitPrice,
  
          customization_notes:
            item.customizationNotes.trim() ||
            null,
  
          sort_order:
            index,
        })
      );
  
    const {
      error: itemError,
    } = await supabase
      .from("order_items")
      .insert(itemRows);
  
    if (itemError) {
      throw new Error(
        itemError.message
      );
    }
  }
  export async function getCustomerOrderUsageFromDatabase(
    customerId: string
  ) {
    const supabase = createClient();
  
    const { data, error } =
      await supabase
        .from("orders")
        .select(`
          id,
          order_code,
          status,
          fulfillment_date
        `)
        .eq(
          "customer_id",
          customerId
        )
        .order("created_at", {
          ascending: false,
        });
  
    if (error) {
      throw new Error(
        error.message
      );
    }
  
    return {
      count:
        data?.length ?? 0,
  
      orders:
        data?.map(
          (order) => ({
            id: order.id,
  
            orderCode:
              order.order_code,
  
            status:
              order.status,
  
            fulfillmentDate:
              order.fulfillment_date,
          })
        ) ?? [],
    };
  }
  
  export async function updateOrderStatusInDatabase(
    orderId: string,
    status: string
  ) {
    const supabase = createClient();
  
    const { error } =
      await supabase
        .from("orders")
        .update({
          status,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", orderId);
  
    if (error) {
      throw new Error(
        error.message
      );
    }
  }
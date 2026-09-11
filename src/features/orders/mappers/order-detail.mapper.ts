import {
    FulfillmentType,
    OrderDetail,
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
  } from "../types/order.types";
  
  type CustomerRelation = {
    customer_code: string;
    name: string;
    phone: string;
  };
  
  type OrderItemDatabaseRow = {
    id: string;
    product_id: string | null;
    product_code: string | null;
    item_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    customization_notes: string | null;
    sort_order: number;
  };
  
  type OrderDetailDatabaseRow = {
    id: string;
    order_code: string;
    customer_id: string;
  
    recipient_name: string | null;
    recipient_phone: string | null;
  
    fulfillment_type: string;
    fulfillment_date: string;
    prep_days: number;
    production_start_date: string | null;
  
    fulfillment_address: string | null;
    fulfillment_fee: number;
  
    subtotal: number;
    discount_amount: number;
    total_amount: number;
    amount_paid: number;
  
    payment_status: string;
    payment_method: string | null;
  
    status: string;
  
    customer_notes: string | null;
    admin_notes: string | null;
  
    created_at: string;
  
    customers:
      | CustomerRelation
      | CustomerRelation[]
      | null;
  
    order_items:
      | OrderItemDatabaseRow[]
      | null;
  };
  
  function getCustomer(
    relation:
      | CustomerRelation
      | CustomerRelation[]
      | null
  ) {
    if (!relation) {
      return null;
    }
  
    if (Array.isArray(relation)) {
      return relation[0] ?? null;
    }
  
    return relation;
  }
  
  export function mapOrderDetailFromDatabase(
    order: OrderDetailDatabaseRow
  ): OrderDetail {
    const customer =
      getCustomer(order.customers);
  
    const totalAmount =
      Number(order.total_amount);
  
    const amountPaid =
      Number(order.amount_paid);
  
    const items =
      order.order_items
        ?.map((item) => ({
          id: item.id,
  
          productId:
            item.product_id ?? undefined,
  
          productCode:
            item.product_code ?? undefined,
  
          itemName:
            item.item_name,
  
          quantity:
            Number(item.quantity),
  
          unitPrice:
            Number(item.unit_price),
  
          lineTotal:
            Number(item.line_total),
  
          customizationNotes:
            item.customization_notes ??
            undefined,
  
          sortOrder:
            item.sort_order,
        }))
        .sort(
          (a, b) =>
            a.sortOrder -
            b.sortOrder
        ) ?? [];
  
    return {
      id: order.id,
  
      orderCode:
        order.order_code,
  
      customerId:
        order.customer_id,
  
      customerCode:
        customer?.customer_code ?? "—",
  
      customerName:
        customer?.name ??
        "Unknown Customer",
  
      customerPhone:
        customer?.phone ?? "—",
  
      recipientName:
        order.recipient_name ??
        undefined,
  
      recipientPhone:
        order.recipient_phone ??
        undefined,
  
      fulfillmentType:
        order.fulfillment_type as FulfillmentType,
  
      fulfillmentDate:
        order.fulfillment_date,

        prepDays:
        Number(order.prep_days),
  
      productionStartDate:
        order.production_start_date ??
        undefined,
  
      fulfillmentAddress:
        order.fulfillment_address ??
        undefined,
  
      fulfillmentFee:
        Number(
          order.fulfillment_fee
        ),
  
      subtotal:
        Number(order.subtotal),
  
      discountAmount:
        Number(
          order.discount_amount
        ),
  
      totalAmount,
  
      amountPaid,
  
      balanceAmount:
        Math.max(
          totalAmount - amountPaid,
          0
        ),
  
      paymentStatus:
        order.payment_status as PaymentStatus,
  
      paymentMethod:
        order.payment_method
          ? (order.payment_method as PaymentMethod)
          : undefined,
  
      status:
        order.status as OrderStatus,
  
      customerNotes:
        order.customer_notes ??
        undefined,
  
      adminNotes:
        order.admin_notes ??
        undefined,
  
      createdAt:
        order.created_at,
  
      items,
    };
  }
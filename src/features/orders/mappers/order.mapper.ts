import {
    FulfillmentType,
    Order,
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
  } from "../types/order.types";
  
  type CustomerRelation = {
    customer_code: string;
    name: string;
    phone: string;
  };
  
  type OrderDatabaseRow = {
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
  
  export function mapOrderFromDatabase(
    order: OrderDatabaseRow
  ): Order {
    const customer =
      getCustomer(order.customers);
  
    const totalAmount =
      Number(order.total_amount);
  
    const amountPaid =
      Number(order.amount_paid);
  
    return {
      id: order.id,
  
      orderCode:
        order.order_code,
  
      customerId:
        order.customer_id,
  
      customerCode:
        customer?.customer_code ?? "—",
  
      customerName:
        customer?.name ?? "Unknown Customer",
  
      customerPhone:
        customer?.phone ?? "—",
  
      recipientName:
        order.recipient_name ?? undefined,
  
      recipientPhone:
        order.recipient_phone ?? undefined,
  
      fulfillmentType:
        order.fulfillment_type as FulfillmentType,
  
      fulfillmentDate:
        order.fulfillment_date,

        prepDays:
        Number(order.prep_days),
  
      productionStartDate:
        order.production_start_date ?? undefined,
  
      fulfillmentAddress:
        order.fulfillment_address ?? undefined,
  
      fulfillmentFee:
        Number(order.fulfillment_fee),
  
      subtotal:
        Number(order.subtotal),
  
      discountAmount:
        Number(order.discount_amount),
  
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
        order.customer_notes ?? undefined,
  
      adminNotes:
        order.admin_notes ?? undefined,
  
      createdAt:
        order.created_at,
    };
  }
import {
    FulfillmentType,
    OrderStatus,
    PaymentMethod,
  } from "./order.types";
  
  export type OrderFormItem = {
    productId?: string;
    productCode?: string;
  
    itemName: string;
  
    quantity: number;
    unitPrice: number;
  
    customizationNotes: string;
  };
  
  export type OrderFormData = {
    customerId: string;
  
    recipientName: string;
    recipientPhone: string;
  
    fulfillmentType: FulfillmentType;
    fulfillmentDate: string;
    prepDays: number;
  
    fulfillmentAddress: string;
    fulfillmentFee: number;
  
    discountAmount: number;
  
    amountPaid: number;
    paymentMethod?: PaymentMethod;
  
    status: OrderStatus;
  
    customerNotes: string;
    adminNotes: string;
  
    items: OrderFormItem[];
  };
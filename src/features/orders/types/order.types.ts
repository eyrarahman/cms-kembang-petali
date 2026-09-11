export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "partial"
  | "paid"
  | "refunded";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "duitnow"
  | "tng"
  | "other";

export type FulfillmentType =
  | "delivery"
  | "postage"
  | "pickup";

export type Order = {
  id: string;
  orderCode: string;

  customerId: string;
  customerCode: string;
  customerName: string;
  customerPhone: string;

  recipientName?: string;
  recipientPhone?: string;

  fulfillmentType: FulfillmentType;
  fulfillmentDate: string;
  prepDays: number;
  productionStartDate?: string;

  fulfillmentAddress?: string;
  fulfillmentFee: number;

  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  amountPaid: number;
  balanceAmount: number;

  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  status: OrderStatus;

  customerNotes?: string;
  adminNotes?: string;

  createdAt: string;
  
};

export type OrderItem = {
    id: string;
  
    productId?: string;
    productCode?: string;
  
    itemName: string;
  
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  
    customizationNotes?: string;
  
    sortOrder: number;
  };
  
  export type OrderDetail = Order & {
    items: OrderItem[];
  };
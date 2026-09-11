export type CustomerOrderUsageItem = {
    id: string;
    orderCode: string;
    status: string;
    fulfillmentDate: string;
  };
  
  export type CustomerOrderUsage = {
    count: number;
    orders: CustomerOrderUsageItem[];
  };
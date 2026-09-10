export type MaterialUsageProduct = {
    productId: string;
    productCode: string;
    productName: string;
  };
  
  export type MaterialUsage = {
    count: number;
    products: MaterialUsageProduct[];
  };
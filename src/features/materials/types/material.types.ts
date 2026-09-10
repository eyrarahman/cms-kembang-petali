export type MaterialCategory =
  | "flower"
  | "wrapping"
  | "ribbon"
  | "decoration"
  | "packaging"
  | "gift"
  | "other";

export type MaterialStatus =
  | "active"
  | "inactive";

export type Material = {
  id: string;
  materialCode: string;
  name: string;
  category: MaterialCategory;
  purchasePrice: number;
  purchaseQuantity: number;
  baseUnit: string;
  unitCost: number;
  status: MaterialStatus;
  notes?: string;
};
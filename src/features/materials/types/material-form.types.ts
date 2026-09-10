import {
    MaterialCategory,
    MaterialStatus,
  } from "./material.types";
  
  export type MaterialFormData = {
    name: string;
    category: MaterialCategory;
    purchasePrice: number;
    purchaseQuantity: number;
    baseUnit: string;
    status: MaterialStatus;
    notes: string;
  };
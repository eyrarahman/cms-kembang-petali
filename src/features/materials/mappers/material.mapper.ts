import {
    Material,
    MaterialCategory,
    MaterialStatus,
  } from "../types/material.types";
  
  type MaterialDatabaseRow = {
    id: string;
    material_code: string;
    name: string;
    category: string;
    purchase_price: number;
    purchase_quantity: number;
    base_unit: string;
    status: string;
    notes: string | null;
  };
  
  export function mapMaterialFromDatabase(
    material: MaterialDatabaseRow
  ): Material {
    const purchasePrice =
      Number(material.purchase_price);
  
    const purchaseQuantity =
      Number(material.purchase_quantity);
  
    const unitCost =
      purchaseQuantity > 0
        ? purchasePrice / purchaseQuantity
        : 0;
  
    return {
      id: material.id,
  
      materialCode:
        material.material_code,
  
      name: material.name,
  
      category:
        material.category as MaterialCategory,
  
      purchasePrice,
  
      purchaseQuantity,
  
      baseUnit:
        material.base_unit,
  
      unitCost,
  
      status:
        material.status as MaterialStatus,
  
      notes:
        material.notes ?? undefined,
    };
  }
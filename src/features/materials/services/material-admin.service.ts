import {
    createMaterialInDatabase,
    deleteMaterialFromDatabase,
    getMaterialUsageFromDatabase,
    updateMaterialInDatabase,
  } from "../repositories/material-admin.repository";
import { MaterialFormData } from "../types/material-form.types";

export async function createMaterial(
  formData: MaterialFormData
) {
  if (!formData.name.trim()) {
    throw new Error(
      "Material name is required."
    );
  }

  if (formData.purchasePrice < 0) {
    throw new Error(
      "Purchase price cannot be negative."
    );
  }

  if (formData.purchaseQuantity <= 0) {
    throw new Error(
      "Purchase quantity must be greater than 0."
    );
  }

  if (!formData.baseUnit.trim()) {
    throw new Error(
      "Base unit is required."
    );
  }

  return createMaterialInDatabase(
    formData
  );
}

export async function updateMaterial(
    materialId: string,
    formData: MaterialFormData
  ) {
    if (!materialId) {
      throw new Error(
        "Material ID is required."
      );
    }
  
    if (!formData.name.trim()) {
      throw new Error(
        "Material name is required."
      );
    }
  
    if (formData.purchasePrice < 0) {
      throw new Error(
        "Purchase price cannot be negative."
      );
    }
  
    if (
      formData.purchaseQuantity <= 0
    ) {
      throw new Error(
        "Purchase quantity must be greater than 0."
      );
    }
  
    if (!formData.baseUnit.trim()) {
      throw new Error(
        "Base unit is required."
      );
    }
  
    return updateMaterialInDatabase(
      materialId,
      formData
    );
  }
  
  export async function deleteMaterial(
    materialId: string
  ) {
    if (!materialId) {
      throw new Error(
        "Material ID is required."
      );
    }
  
    const usage =
      await getMaterialUsageFromDatabase(
        materialId
      );
  
    if (usage.count > 0) {
      throw new Error(
        "This material is currently used in a product recipe."
      );
    }
  
    return deleteMaterialFromDatabase(
      materialId
    );
  }

  export async function getMaterialUsage(
    materialId: string
  ) {
    if (!materialId) {
      throw new Error(
        "Material ID is required."
      );
    }
  
    return getMaterialUsageFromDatabase(
      materialId
    );
  }
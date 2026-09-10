import {
    createRecipeInDatabase,
    updateRecipeInDatabase,
  } from "../repositories/recipe-admin.repository";
import { RecipeFormData } from "../types/recipe-form.types";

export async function createRecipe(
  productId: string,
  formData: RecipeFormData
) {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  if (formData.items.length === 0) {
    throw new Error(
      "Please add at least one material."
    );
  }

  const invalidItem =
    formData.items.some(
      (item) =>
        !item.materialId ||
        item.quantity <= 0
    );

  if (invalidItem) {
    throw new Error(
      "All materials must have a valid quantity."
    );
  }

  const materialIds =
    formData.items.map(
      (item) =>
        item.materialId
    );

  const uniqueMaterialIds =
    new Set(materialIds);

  if (
    uniqueMaterialIds.size !==
    materialIds.length
  ) {
    throw new Error(
      "The same material cannot be added twice."
    );
  }

  if (formData.laborCost < 0) {
    throw new Error(
      "Labor cost cannot be negative."
    );
  }

  if (formData.otherCost < 0) {
    throw new Error(
      "Other cost cannot be negative."
    );
  }

  if (
    formData.wastagePercent < 0 ||
    formData.wastagePercent > 100
  ) {
    throw new Error(
      "Wastage must be between 0 and 100%."
    );
  }

  if (
    formData.targetMarginPercent < 0 ||
    formData.targetMarginPercent >= 100
  ) {
    throw new Error(
      "Target margin must be between 0 and less than 100%."
    );
  }

  return createRecipeInDatabase(
    productId,
    formData
  );
}
export async function updateRecipe(
    recipeId: string,
    formData: RecipeFormData
  ) {
    if (!recipeId) {
      throw new Error(
        "Recipe ID is required."
      );
    }
  
    if (formData.items.length === 0) {
      throw new Error(
        "Please add at least one material."
      );
    }
  
    const invalidItem =
      formData.items.some(
        (item) =>
          !item.materialId ||
          item.quantity <= 0
      );
  
    if (invalidItem) {
      throw new Error(
        "All materials must have a valid quantity."
      );
    }
  
    const materialIds =
      formData.items.map(
        (item) =>
          item.materialId
      );
  
    if (
      new Set(materialIds).size !==
      materialIds.length
    ) {
      throw new Error(
        "The same material cannot be added twice."
      );
    }
  
    if (formData.laborCost < 0) {
      throw new Error(
        "Labor cost cannot be negative."
      );
    }
  
    if (formData.otherCost < 0) {
      throw new Error(
        "Other cost cannot be negative."
      );
    }
  
    if (
      formData.wastagePercent < 0 ||
      formData.wastagePercent > 100
    ) {
      throw new Error(
        "Wastage must be between 0 and 100%."
      );
    }
  
    if (
      formData.targetMarginPercent < 0 ||
      formData.targetMarginPercent >= 100
    ) {
      throw new Error(
        "Target margin must be between 0 and less than 100%."
      );
    }
  
    return updateRecipeInDatabase(
      recipeId,
      formData
    );
  }


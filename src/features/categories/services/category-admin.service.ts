import {
    createCategoryInDatabase,
    deleteCategoryFromDatabase,
    getCategoryProductCountFromDatabase,
    updateCategoryInDatabase,
  } from "../repositories/category-admin.repository";
import { CategoryFormData } from "../types/category-form.types";

export async function createCategory(
  formData: CategoryFormData
) {
  if (!formData.name.trim()) {
    throw new Error(
      "Category name is required."
    );
  }

  if (!formData.slug.trim()) {
    throw new Error(
      "Category slug is required."
    );
  }

  return createCategoryInDatabase(
    formData
  );
}

export async function updateCategory(
    categoryId: string,
    formData: CategoryFormData
  ) {
    if (!categoryId) {
      throw new Error(
        "Category ID is required."
      );
    }
  
    if (!formData.name.trim()) {
      throw new Error(
        "Category name is required."
      );
    }
  
    if (!formData.slug.trim()) {
      throw new Error(
        "Category slug is required."
      );
    }
  
    return updateCategoryInDatabase(
      categoryId,
      formData
    );
  }

  export async function getCategoryProductCount(
    categoryId: string
  ) {
    if (!categoryId) {
      throw new Error(
        "Category ID is required."
      );
    }
  
    return getCategoryProductCountFromDatabase(
      categoryId
    );
  }
  
  export async function deleteCategory(
    categoryId: string
  ) {
    if (!categoryId) {
      throw new Error(
        "Category ID is required."
      );
    }
  
    return deleteCategoryFromDatabase(
      categoryId
    );
  }
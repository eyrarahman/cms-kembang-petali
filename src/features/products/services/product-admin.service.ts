import { createProductInDatabase } from "../repositories/product-admin.repository";
import { ProductFormData } from "../types/product-form.types";

export async function createProduct(
  formData: ProductFormData
) {
  if (!formData.name.trim()) {
    throw new Error("Product name is required.");
  }

  if (!formData.slug.trim()) {
    throw new Error("Product slug is required.");
  }

  if (formData.sellingPrice < 0) {
    throw new Error("Selling price cannot be negative.");
  }

  if (formData.images.length === 0) {
    throw new Error(
      "Please upload at least one product image."
    );
  }

  const hasPrimaryImage =
    formData.images.some(
      (image) => image.isPrimary
    );

  if (!hasPrimaryImage) {
    throw new Error(
      "Please select a main product image."
    );
  }

  return createProductInDatabase(formData);
}
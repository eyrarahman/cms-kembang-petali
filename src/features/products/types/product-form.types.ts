import { PendingProductImage } from "./product-image-upload.types";
import { ProductImage } from "./product-image.types";
import { ProductStatus } from "./product.types";

export type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  sellingPrice: number;
  status: ProductStatus;
  featured: boolean;
  categoryIds: string[];
  images: PendingProductImage[];
};

export type ProductUpdateFormData = Omit<
  ProductFormData,
  "images"
> & {
  existingImages: ProductImage[];
  newImages: PendingProductImage[];
  deletedImages: ProductImage[];
};
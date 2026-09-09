import { PendingProductImage } from "./product-image-upload.types";
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
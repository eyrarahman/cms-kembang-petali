import { ProductImage } from "./product-image.types";

export type ProductStatus =
  | "available"
  | "pre_order"
  | "sold_out"
  | "hidden";

export type Product = {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  price: number;
  description?: string;

  categorySlugs: string[];

  status: ProductStatus;
  featured: boolean;

  images: ProductImage[];
  mainImage?: ProductImage;
};
import { Category } from "./category.types";

export type CategoryFormData = {
  name: string;
  slug: string;
  type: Category["type"];
};
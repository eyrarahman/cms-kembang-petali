import { HomeScreen } from "@/features/home/components/HomeScreen";
import { getFeaturedProducts } from "@/features/products/services/product.service";
import { getCategories } from "@/features/categories/services/category.service";

export default async function HomePage() {
  const featuredProducts =
    await getFeaturedProducts();

  const categories =
    await getCategories();

  return (
    <HomeScreen
      featuredProducts={featuredProducts}
      categories={categories}
    />
  );
}
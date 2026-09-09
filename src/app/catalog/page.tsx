import { CatalogScreen } from "@/features/products/components/CatalogScreen";
import { getProducts } from "@/features/products/services/product.service";
import { getCategories } from "@/features/categories/services/category.service";

export default async function CatalogPage() {
    const products = await getProducts();
    const categories = await getCategories();

    return (
        <CatalogScreen
            products={products}
            categories={categories}
        />
    );
}
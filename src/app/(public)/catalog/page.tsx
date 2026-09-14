import { CatalogScreen } from "@/features/products/components/CatalogScreen";

import { getProducts } from "@/features/products/services/product.service";
import { getCategories } from "@/features/categories/services/category.service";
import { getBusinessSettings } from "@/features/settings/services/settings.service";

export default async function CatalogPage() {
    const [
        products,
        categories,
        settings,
    ] = await Promise.all([
        getProducts(),
        getCategories(),
        getBusinessSettings(),
    ]);

    return (
        <CatalogScreen
            products={products}
            categories={categories}
            businessName={
                settings.businessName
            }
        />
    );
}
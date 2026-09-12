import { HomeScreen } from "@/features/home/components/HomeScreen";

import { getFeaturedProducts } from "@/features/products/services/product.service";
import { getCategories } from "@/features/categories/services/category.service";
import { getBusinessSettings } from "@/features/settings/services/settings.service";

export default async function HomePage() {
    const [
        featuredProducts,
        categories,
        settings,
    ] = await Promise.all([
        getFeaturedProducts(),
        getCategories(),
        getBusinessSettings(),
    ]);

    return (
        <HomeScreen
            featuredProducts={
                featuredProducts
            }
            categories={categories}
            businessName={
                settings.businessName
            }
        />
    );
}
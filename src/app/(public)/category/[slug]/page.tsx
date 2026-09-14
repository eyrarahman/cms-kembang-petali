import { notFound } from "next/navigation";

import { CategoryScreen } from "@/features/categories/components/CategoryScreen";
import { getCategoryBySlug } from "@/features/categories/services/category.service";
import { getProductsByCategorySlug } from "@/features/products/services/product.service";
import { getBusinessSettings } from "@/features/settings/services/settings.service";

type CategoryPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function CategoryPage({
    params,
}: CategoryPageProps) {
    const { slug } = await params;

    const [
        category,
        products,
        settings,
    ] = await Promise.all([
        getCategoryBySlug(slug),
        getProductsByCategorySlug(slug),
        getBusinessSettings(),
    ]);

    if (!category) {
        notFound();
    }

    return (
        <CategoryScreen
            category={category}
            products={products}
            businessName={
                settings.businessName
            }
        />
    );
}
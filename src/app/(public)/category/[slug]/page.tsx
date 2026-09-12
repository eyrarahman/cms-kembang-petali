import { notFound } from "next/navigation";

import { CategoryScreen } from "@/features/categories/components/CategoryScreen";
import { getCategoryBySlug } from "@/features/categories/services/category.service";
import { getProductsByCategorySlug } from "@/features/products/services/product.service";

type CategoryPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function CategoryPage({
    params,
}: CategoryPageProps) {
    const { slug } = await params;

    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const products =
        await getProductsByCategorySlug(slug);

    return (
        <CategoryScreen
            category={category}
            products={products}
        />
    );
}
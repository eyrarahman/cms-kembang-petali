import { notFound } from "next/navigation";

import { ProductDetailScreen } from "@/features/products/components/ProductDetailScreen";
import { getProductBySlug } from "@/features/products/services/product.service";

type ProductPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ProductPage({
    params,
}: ProductPageProps) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <ProductDetailScreen
            product={product}
        />
    );
}
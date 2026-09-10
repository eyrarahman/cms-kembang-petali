import { notFound } from "next/navigation";

import { ProductForm } from "@/features/products/components/ProductForm";
import { getCategories } from "@/features/categories/services/category.service";
import { getAdminProductById } from "@/features/products/services/product.service";

type EditProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;

    const [
        product,
        categories,
    ] = await Promise.all([
        getAdminProductById(id),
        getCategories(),
    ]);

    if (!product) {
        notFound();
    }

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-5xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Catalog Management
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Edit Product
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {product.productCode} ·{" "}
                        {product.name}
                    </p>
                </div>

                <ProductForm
                    mode="edit"
                    product={product}
                    categories={categories}
                />
            </div>
        </main>
    );
}
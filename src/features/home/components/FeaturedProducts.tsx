import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Product } from "@/features/products/types/product.types";

type FeaturedProductsProps = {
    products: Product[];
    businessName: string;
};

export function FeaturedProducts({
    products,
    businessName,
}: FeaturedProductsProps) {
    return (
        <section className="bg-white px-6 py-20">
            <div className="mx-auto max-w-7xl">
                <SectionHeader
                    eyebrow="Our Collection"
                    title="Featured Products"
                    description={`Pilihan produk istimewa daripada ${businessName}.`}
                />

                {products.length > 0 ? (
                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 rounded-2xl border border-rose-100 bg-rose-50 p-10 text-center">
                        <p className="font-medium text-gray-700">
                            No featured products yet.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            More special products will be available soon.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
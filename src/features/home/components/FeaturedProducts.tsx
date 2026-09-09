import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Product } from "@/features/products/types/product.types";

type FeaturedProductsProps = {
    products: Product[];
};

export function FeaturedProducts({
    products,
}: FeaturedProductsProps) {
    return (
        <section className="bg-white px-6 py-20">
            <div className="mx-auto max-w-7xl">
                <SectionHeader
                    eyebrow="Our Collection"
                    title="Featured Products"
                    description="Pilihan produk istimewa daripada Kembang Petali."
                />

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
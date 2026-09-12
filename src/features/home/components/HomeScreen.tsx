import Link from "next/link";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Product } from "@/features/products/types/product.types";
import { Category } from "@/features/categories/types/category.types";
import { FeaturedProducts } from "./FeaturedProducts";
import { ShopByOccasion } from "./ShopByOccasion";

type HomeScreenProps = {
    featuredProducts: Product[];
    categories: Category[];
    businessName: string;
};

export function HomeScreen({
    featuredProducts,
    categories,
    businessName,
}: HomeScreenProps) {
    return (
        <main className="min-h-screen bg-rose-50">
            <Navbar
                businessName={businessName}
            />

            <section className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6 text-center">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-rose-500">
                    {businessName}
                </p>

                <h1 className="max-w-3xl text-4xl font-bold text-gray-900 sm:text-6xl">
                    Hadiah Istimewa Untuk Insan Tersayang
                </h1>

                <p className="mt-6 max-w-xl text-lg text-gray-600">
                    Pilih produk kegemaran anda untuk graduation, birthday,
                    anniversary dan pelbagai lagi majlis istimewa.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link href="/catalog">
                        <Button>
                            Browse Catalog
                        </Button>
                    </Link>

                    <Button variant="secondary">
                        Contact Us
                    </Button>
                </div>
            </section>

            <FeaturedProducts
                products={featuredProducts}
            />

            <ShopByOccasion
                categories={categories}
            />
        </main>
    );
}
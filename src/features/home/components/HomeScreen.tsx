import Link from "next/link";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Product } from "@/features/products/types/product.types";
import { Category } from "@/features/categories/types/category.types";
import { FeaturedProducts } from "./FeaturedProducts";
import { ShopByOccasion } from "./ShopByOccasion";
import Image from "next/image";

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
                variant="hero"
            />

            <section className="relative overflow-hidden bg-[#9f3658]">
                <div className="mx-auto grid min-h-155 max-w-7xl grid-cols-1 items-center lg:grid-cols-[0.85fr_1.15fr]">
                    {/* LEFT CONTENT */}
                    <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-6 lg:py-20">

                        <h1 className="mt-5 max-w-xl text-5xl font-bold leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                            Hadiah Istimewa
                            <span className="block text-rose-100">
                                Untuk Insan
                            </span>
                            <span className="block">
                                Tersayang.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-md text-base leading-7 text-rose-100/90 sm:text-lg">
                            Menguntumkan bahagia dalam setiap momen istimewa.
                            Hadiah penuh makna untuk meraikan insan dan
                            kenangan yang berharga.
                        </p>

                        <div className="mt-9">
                            <Link
                                href="/catalog"
                                className="inline-flex items-center gap-4 rounded-xl bg-rose-50 px-6 py-3.5 text-sm font-semibold text-[#9f3658] transition hover:bg-white"
                            >
                                Browse Catalog
                                <span aria-hidden="true">
                                    →
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="relative min-h-105 self-stretch lg:min-h-155">
                        <Image
                            src="/assets/products/banner-page.png"
                            alt="Kembang Petali bouquet"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            className="object-contain object-bottom-right scale-[0.85] lg:translate-x-8 origin-bottom"
                        />
                    </div>
                </div>
            </section>

            <FeaturedProducts
                products={featuredProducts}
                businessName={businessName}
            />

            <ShopByOccasion
                categories={categories}
            />
        </main>
    );
}
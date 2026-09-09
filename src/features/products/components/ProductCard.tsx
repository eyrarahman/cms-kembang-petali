import { Product } from "../types/product.types";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
    product: Product;
};

export function ProductCard({
    product,
}: ProductCardProps) {
    return (
        <article className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
            <div className="relative aspect-square overflow-hidden bg-rose-100">
                {product.mainImage ? (
                    <Image
                        src={product.mainImage.url}
                        alt={product.mainImage.altText ?? product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-rose-400">
                            No image
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        {product.description}
                    </p>
                )}

                <div className="mt-5 flex items-center justify-between">
                    <p className="text-lg font-bold text-rose-500">
                        RM {product.price.toFixed(2)}
                    </p>

                    <Link href={`/product/${product.slug}`}>
                        <Button variant="secondary">
                            View
                        </Button>
                    </Link>
                </div>
            </div>
        </article>
    );
}
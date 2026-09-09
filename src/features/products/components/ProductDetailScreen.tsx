import Link from "next/link";
import { Product } from "../types/product.types";
import { Button } from "@/components/ui/Button";

type ProductDetailScreenProps = {
    product: Product;
};

const whatsappNumber = "60123507834";

export function ProductDetailScreen({
    product,
}: ProductDetailScreenProps) {
    const whatsappMessage = `Hi Kembang Petali, saya berminat dengan ${product.name} (RM ${product.price.toFixed(
        2
    )}). Boleh saya tahu availability?`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
    )}`;

    return (
        <main className="min-h-screen bg-rose-50 px-6 py-12">
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/"
                    className="text-sm font-medium text-rose-500"
                >
                    ← Back to Home
                </Link>

                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
                    <div className="flex aspect-square items-center justify-center rounded-3xl bg-rose-100">
                        <span className="text-sm font-medium text-rose-400">
                            Product Image
                        </span>
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            Kembang Petali
                        </p>

                        <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
                            {product.name}
                        </h1>

                        <p className="mt-5 text-2xl font-bold text-rose-500">
                            RM {product.price.toFixed(2)}
                        </p>

                        {product.description && (
                            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                                {product.description}
                            </p>
                        )}

                        <div className="mt-8">
                            <p className="text-sm font-semibold text-gray-900">
                                Suitable for
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {product.categorySlugs.map((category) => (
                                    <span
                                        key={category}
                                        className="rounded-full bg-white px-4 py-2 text-sm text-gray-600"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button>
                                    Order via WhatsApp
                                </Button>
                            </a>
                            <Link href="/catalog">
                                <Button variant="secondary">
                                    Back to Catalog
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
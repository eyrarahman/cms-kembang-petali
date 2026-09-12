import Link from "next/link";
import { Product } from "../types/product.types";
import { Button } from "@/components/ui/Button";
import { getBusinessSettings } from "@/features/settings/services/settings.service";
import { createWhatsappUrl } from "@/features/settings/utils/whatsapp.utils";

type ProductDetailScreenProps = {
    product: Product;
};



export async function ProductDetailScreen({
    product,
}: ProductDetailScreenProps) {
    const settings =
        await getBusinessSettings();

    const whatsappMessage =
        `Hi ${settings.businessName}, saya berminat dengan ${product.name} ` +
        `(RM ${product.price.toFixed(2)}). ` +
        `Boleh saya tahu availability?`;

    const whatsappUrl =
        settings.whatsappNumber
            ? createWhatsappUrl(
                settings.whatsappNumber,
                whatsappMessage
            )
            : undefined;

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
                            {settings.businessName}
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

                        {(settings.deliveryInfo ||
                            settings.postageInfo) && (
                                <div className="mt-8 rounded-2xl border border-rose-100 bg-white p-5">
                                    <p className="font-semibold text-gray-900">
                                        Delivery & Postage
                                    </p>

                                    <div className="mt-4 space-y-4 text-sm leading-6 text-gray-600">
                                        {settings.deliveryInfo && (
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Delivery
                                                </p>

                                                <p className="mt-1 whitespace-pre-line">
                                                    {settings.deliveryInfo}
                                                </p>
                                            </div>
                                        )}

                                        {settings.postageInfo && (
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Postage
                                                </p>

                                                <p className="mt-1 whitespace-pre-line">
                                                    {settings.postageInfo}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            {whatsappUrl ? (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button>
                                        Order via WhatsApp
                                    </Button>
                                </a>
                            ) : (
                                <Button disabled>
                                    WhatsApp Unavailable
                                </Button>
                            )}
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
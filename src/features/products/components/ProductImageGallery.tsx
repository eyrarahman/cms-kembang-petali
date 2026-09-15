"use client";

import Image from "next/image";
import { useState } from "react";

import type { Product } from "../types/product.types";

type ProductImageGalleryProps = {
    images: Product["images"];
    mainImage?: Product["mainImage"];
    productName: string;
};

export function ProductImageGallery({
    images,
    mainImage,
    productName,
}: ProductImageGalleryProps) {
    const orderedImages = mainImage
        ? [
            mainImage,
            ...images.filter(
                (image) =>
                    image.id !== mainImage.id
            ),
        ]
        : images;

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(
        orderedImages[0]
    );

    if (
        orderedImages.length === 0 ||
        !selectedImage
    ) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-3xl bg-rose-100">
                <span className="text-sm font-medium text-rose-400">
                    No image
                </span>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-5 sm:flex-row">
            {/* THUMBNAILS */}
            {orderedImages.length > 1 && (
                <div className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:max-h-[560px] sm:w-[76px] sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0">
                    {orderedImages.map(
                        (image) => {
                            const isSelected =
                                image.id ===
                                selectedImage.id;

                            return (
                                <button
                                    key={
                                        image.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        setSelectedImage(
                                            image
                                        )
                                    }
                                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition sm:h-[72px] sm:w-[72px] ${isSelected
                                        ? "border-rose-500"
                                        : "border-transparent hover:border-rose-200"
                                        }`}
                                    aria-label={`View ${productName} image`}
                                >
                                    <Image
                                        src={
                                            image.url
                                        }
                                        alt={
                                            image.altText ??
                                            productName
                                        }
                                        fill
                                        sizes="72px"
                                        className="object-cover"
                                    />
                                </button>
                            );
                        }
                    )}
                </div>
            )}

            {/* MAIN IMAGE */}
            <div className="order-1 w-full min-w-0 flex-1 sm:order-2">
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
                    <Image
                        src={selectedImage.url}
                        alt={
                            selectedImage.altText ??
                            productName
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 45vw"
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
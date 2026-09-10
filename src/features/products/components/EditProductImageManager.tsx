"use client";

import Image from "next/image";
import { ChangeEvent } from "react";

import { ProductImage } from "../types/product-image.types";
import { PendingProductImage } from "../types/product-image-upload.types";

type EditProductImageManagerProps = {
    existingImages: ProductImage[];
    newImages: PendingProductImage[];
    onExistingImagesChange: (images: ProductImage[]) => void;
    onNewImagesChange: (images: PendingProductImage[]) => void;
    onDeleteExistingImage: (image: ProductImage) => void;
};

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export function EditProductImageManager({
    existingImages,
    newImages,
    onExistingImagesChange,
    onNewImagesChange,
    onDeleteExistingImage,
}: EditProductImageManagerProps) {
    const totalImages =
        existingImages.length + newImages.length;

    function handleFileChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const selectedFiles = Array.from(
            event.target.files ?? []
        );

        const availableSlots =
            MAX_IMAGES - totalImages;

        const filesToAdd =
            selectedFiles.slice(0, availableSlots);

        const validFiles =
            filesToAdd.filter((file) => {
                return (
                    ALLOWED_TYPES.includes(file.type) &&
                    file.size <= MAX_FILE_SIZE
                );
            });

        const shouldSetFirstAsPrimary =
            totalImages === 0;

        const createdImages =
            validFiles.map((file, index) => ({
                id: crypto.randomUUID(),
                file,
                previewUrl: URL.createObjectURL(file),

                isPrimary:
                    shouldSetFirstAsPrimary &&
                    index === 0,
            }));

        onNewImagesChange([
            ...newImages,
            ...createdImages,
        ]);

        event.target.value = "";
    }

    function setExistingAsPrimary(
        imageId: string
    ) {
        onExistingImagesChange(
            existingImages.map((image) => ({
                ...image,
                isPrimary: image.id === imageId,
            }))
        );

        onNewImagesChange(
            newImages.map((image) => ({
                ...image,
                isPrimary: false,
            }))
        );
    }

    function setNewAsPrimary(
        imageId: string
    ) {
        onExistingImagesChange(
            existingImages.map((image) => ({
                ...image,
                isPrimary: false,
            }))
        );

        onNewImagesChange(
            newImages.map((image) => ({
                ...image,
                isPrimary: image.id === imageId,
            }))
        );
    }

    function removeNewImage(
        imageId: string
    ) {
        const imageToRemove =
            newImages.find(
                (image) => image.id === imageId
            );

        if (imageToRemove) {
            URL.revokeObjectURL(
                imageToRemove.previewUrl
            );
        }

        let remainingNewImages =
            newImages.filter(
                (image) => image.id !== imageId
            );

        const hasPrimary =
            existingImages.some(
                (image) => image.isPrimary
            ) ||
            remainingNewImages.some(
                (image) => image.isPrimary
            );

        if (!hasPrimary) {
            if (existingImages.length > 0) {
                onExistingImagesChange(
                    existingImages.map(
                        (image, index) => ({
                            ...image,
                            isPrimary: index === 0,
                        })
                    )
                );
            } else if (
                remainingNewImages.length > 0
            ) {
                remainingNewImages =
                    remainingNewImages.map(
                        (image, index) => ({
                            ...image,
                            isPrimary: index === 0,
                        })
                    );
            }
        }

        onNewImagesChange(
            remainingNewImages
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Product Images
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage existing images or upload new ones.
                        Maximum {MAX_IMAGES} images.
                    </p>
                </div>

                {totalImages < MAX_IMAGES && (
                    <label className="cursor-pointer rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50">
                        + Add Images

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {totalImages === 0 ? (
                <div className="mt-6 flex min-h-48 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-400">
                        No images
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {existingImages.map((image) => (
                        <div
                            key={image.id}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                        >
                            <div className="relative aspect-square bg-gray-100">
                                <Image
                                    src={image.url}
                                    alt={image.altText ?? "Product image"}
                                    fill
                                    sizes="250px"
                                    className="object-cover"
                                />

                                {image.isPrimary && (
                                    <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
                                        ★ Main
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 p-3">
                                {!image.isPrimary && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExistingAsPrimary(
                                                image.id
                                            )
                                        }
                                        className="w-full rounded-lg border border-rose-200 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50"
                                    >
                                        Set as Main
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDeleteExistingImage(
                                            image
                                        )
                                    }
                                    className="w-full rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {newImages.map((image) => (
                        <div
                            key={image.id}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                        >
                            <div className="relative aspect-square bg-gray-100">
                                <img
                                    src={image.previewUrl}
                                    alt={image.file.name}
                                    className="h-full w-full object-cover"
                                />

                                <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-1 text-xs text-gray-500">
                                    New
                                </span>

                                {image.isPrimary && (
                                    <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
                                        ★ Main
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 p-3">
                                {!image.isPrimary && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setNewAsPrimary(
                                                image.id
                                            )
                                        }
                                        className="w-full rounded-lg border border-rose-200 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50"
                                    >
                                        Set as Main
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeNewImage(
                                            image.id
                                        )
                                    }
                                    className="w-full rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="mt-4 text-xs text-gray-400">
                {totalImages} / {MAX_IMAGES} images
            </p>
        </div>
    );
}
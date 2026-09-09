"use client";

import { ChangeEvent } from "react";

import { PendingProductImage } from "../types/product-image-upload.types";

type ProductImageUploaderProps = {
    images: PendingProductImage[];
    onChange: (images: PendingProductImage[]) => void;
};

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export function ProductImageUploader({
    images,
    onChange,
}: ProductImageUploaderProps) {
    function handleFileChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const selectedFiles = Array.from(
            event.target.files ?? []
        );

        if (selectedFiles.length === 0) {
            return;
        }

        const availableSlots =
            MAX_IMAGES - images.length;

        const filesToAdd =
            selectedFiles.slice(
                0,
                availableSlots
            );

        const validFiles =
            filesToAdd.filter((file) => {
                const isValidType =
                    ALLOWED_TYPES.includes(
                        file.type
                    );

                const isValidSize =
                    file.size <= MAX_FILE_SIZE;

                return (
                    isValidType &&
                    isValidSize
                );
            });

        const newImages =
            validFiles.map(
                (file, index) => ({
                    id: crypto.randomUUID(),

                    file,

                    previewUrl:
                        URL.createObjectURL(file),

                    isPrimary:
                        images.length === 0 &&
                        index === 0,
                })
            );

        onChange([
            ...images,
            ...newImages,
        ]);

        event.target.value = "";
    }

    function handleSetPrimary(
        imageId: string
    ) {
        const updatedImages =
            images.map((image) => ({
                ...image,
                isPrimary:
                    image.id === imageId,
            }));

        onChange(updatedImages);
    }

    function handleRemove(
        imageId: string
    ) {
        const imageToRemove =
            images.find(
                (image) =>
                    image.id === imageId
            );

        if (imageToRemove) {
            URL.revokeObjectURL(
                imageToRemove.previewUrl
            );
        }

        const remainingImages =
            images.filter(
                (image) =>
                    image.id !== imageId
            );

        const hasPrimary =
            remainingImages.some(
                (image) =>
                    image.isPrimary
            );

        if (
            remainingImages.length > 0 &&
            !hasPrimary
        ) {
            remainingImages[0] = {
                ...remainingImages[0],
                isPrimary: true,
            };
        }

        onChange(remainingImages);
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Product Images
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Upload up to {MAX_IMAGES} images.
                        JPG, PNG or WebP. Maximum 5MB each.
                    </p>
                </div>

                {images.length < MAX_IMAGES && (
                    <label className="cursor-pointer rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-50">
                        + Upload Images

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

            {images.length === 0 ? (
                <div className="mt-6 flex min-h-48 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                    <div className="text-center">
                        <p className="font-medium text-gray-600">
                            No images selected
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            Upload product images to get started.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                        >
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                <img
                                    src={image.previewUrl}
                                    alt={image.file.name}
                                    className="h-full w-full object-cover"
                                />

                                {image.isPrimary && (
                                    <div className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
                                        ★ Main
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 p-3">
                                <p
                                    className="truncate text-xs text-gray-500"
                                    title={image.file.name}
                                >
                                    {image.file.name}
                                </p>

                                {!image.isPrimary && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetPrimary(
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
                                        handleRemove(
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

            {images.length > 0 && (
                <p className="mt-4 text-xs text-gray-400">
                    {images.length} / {MAX_IMAGES} images selected
                </p>
            )}
        </div>
    );
}
import Link from "next/link";

import { getBusinessSettings } from "@/features/settings/services/settings.service";
import { createWhatsappUrl } from "@/features/settings/utils/whatsapp.utils";

export async function Footer() {
    const settings =
        await getBusinessSettings();

    const whatsappUrl =
        settings.whatsappNumber
            ? createWhatsappUrl(
                  settings.whatsappNumber,
                  `Hi ${settings.businessName}, saya nak tanya mengenai produk ${settings.businessName}.`
              )
            : undefined;

    const instagramUrl =
        settings.instagramHandle
            ? `https://www.instagram.com/${settings.instagramHandle.replace(
                  /^@/,
                  ""
              )}`
            : undefined;

    const tiktokUrl =
        settings.tiktokHandle
            ? `https://www.tiktok.com/@${settings.tiktokHandle.replace(
                  /^@/,
                  ""
              )}`
            : undefined;

    return (
        <footer className="border-t border-rose-100 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                    {/* BUSINESS */}
                    <div>
                        <p className="text-xl font-bold text-gray-900">
                            {settings.businessName}
                        </p>

                        <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                            Flowers, bouquets and gifts
                            made for your special
                            moments.
                        </p>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <p className="font-semibold text-gray-900">
                            Quick Links
                        </p>

                        <div className="mt-4 flex flex-col gap-3 text-sm">
                            <Link
                                href="/"
                                className="text-gray-500 hover:text-rose-500"
                            >
                                Home
                            </Link>

                            <Link
                                href="/catalog"
                                className="text-gray-500 hover:text-rose-500"
                            >
                                Catalog
                            </Link>

                            <Link
                                href="/about"
                                className="text-gray-500 hover:text-rose-500"
                            >
                                About
                            </Link>

                            <Link
                                href="/contact"
                                className="text-gray-500 hover:text-rose-500"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <p className="font-semibold text-gray-900">
                            Contact
                        </p>

                        <div className="mt-4 space-y-3 text-sm text-gray-500">
                            {whatsappUrl && (
                                <p>
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-rose-500"
                                    >
                                        WhatsApp
                                    </a>
                                </p>
                            )}

                            {settings.contactEmail && (
                                <p>
                                    <a
                                        href={`mailto:${settings.contactEmail}`}
                                        className="hover:text-rose-500"
                                    >
                                        {
                                            settings.contactEmail
                                        }
                                    </a>
                                </p>
                            )}

                            {/* {settings.businessAddress && (
                                <p className="max-w-sm leading-6">
                                    {
                                        settings.businessAddress
                                    }
                                </p>
                            )} */}

                            <div className="flex gap-4 pt-2">
                                {instagramUrl && (
                                    <a
                                        href={instagramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-gray-600 hover:text-rose-500"
                                    >
                                        Instagram
                                    </a>
                                )}

                                {tiktokUrl && (
                                    <a
                                        href={tiktokUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-gray-600 hover:text-rose-500"
                                    >
                                        TikTok
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-100 pt-6">
                    <p className="text-center text-xs text-gray-400">
                        © {new Date().getFullYear()}{" "}
                        {settings.businessName}. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
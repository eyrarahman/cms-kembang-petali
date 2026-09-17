import Link from "next/link";
import Image from "next/image";

import { getBusinessSettings } from "@/features/settings/services/settings.service";
import { createWhatsappUrl } from "@/features/settings/utils/whatsapp.utils";
import { VisitorCounter } from "@/features/analytics/components/VisitorCounter";

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

    const threadsUrl =
        settings.instagramHandle
            ? `https://www.threads.net/@${settings.instagramHandle.replace(
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
                        <div className="flex items-start gap-4">
                            {/* LOGO */}
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-rose-100 bg-white">
                                <Image
                                    src="/assets/branding/logo.png"
                                    alt={settings.businessName}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* BUSINESS DETAILS */}
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {settings.businessName}
                                </p>

                                <p className="mt-3 max-w-md text-sm font-medium leading-6 text-gray-700">
                                    Menguntumkan bahagia dalam setiap momen istimewa.
                                </p>

                                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                                    Hadiah istimewa yang penuh makna, untuk meraikan
                                    setiap insan dan kenangan yang berharga.
                                </p>

                                {/* SOCIAL MEDIA */}
                                <div className="mt-6 flex items-center gap-3">
                                    {instagramUrl && (
                                        <a
                                            href={instagramUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            title="Instagram"
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 transition hover:bg-rose-200"
                                        >
                                            <Image
                                                src="/assets/social/instagram.png"
                                                alt="Instagram"
                                                width={20}
                                                height={20}
                                            />
                                        </a>
                                    )}

                                    {tiktokUrl && (
                                        <a
                                            href={tiktokUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="TikTok"
                                            title="TikTok"
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 transition hover:bg-rose-200"
                                        >
                                            <Image
                                                src="/assets/social/tiktok.png"
                                                alt="TikTok"
                                                width={20}
                                                height={20}
                                            />
                                        </a>
                                    )}

                                    {threadsUrl && (
                                        <a
                                            href={threadsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Threads"
                                            title="Threads"
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 transition hover:bg-rose-200"
                                        >
                                            <Image
                                                src="/assets/social/threads.png"
                                                alt="Threads"
                                                width={20}
                                                height={20}
                                            />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
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

                        <div className="mt-4 space-y-4 text-sm text-gray-500">
                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 transition hover:text-rose-500"
                                >
                                    <Image
                                        src="/assets/social/whatsapp.png"
                                        alt="whatsapp"
                                        width={20}
                                        height={20}
                                        className="shrink-0"
                                    />

                                    <span>
                                        {settings.whatsappNumber}
                                    </span>
                                </a>
                            )}

                            {settings.contactEmail && (
                                <a
                                    href={`mailto:${settings.contactEmail}`}
                                    className="flex items-center gap-3 transition hover:text-rose-500"
                                >
                                    <Image
                                        src="/assets/social/gmail.png"
                                        alt="Email"
                                        width={20}
                                        height={20}
                                        className="shrink-0"
                                    />

                                    <span>
                                        {settings.contactEmail}
                                    </span>
                                </a>
                            )}
                        </div>
                        {/* VISITOR COUNTER */}
                        <VisitorCounter />
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-100 pt-6">
                    <p className="text-center text-xs text-gray-400">
                        © {new Date().getFullYear()}{" "}
                        {settings.businessName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
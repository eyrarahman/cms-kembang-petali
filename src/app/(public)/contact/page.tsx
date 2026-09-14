import { Navbar } from "@/components/layout/Navbar";

import { getBusinessSettings } from "@/features/settings/services/settings.service";
import { createWhatsappUrl } from "@/features/settings/utils/whatsapp.utils";

export default async function ContactPage() {
    const settings =
        await getBusinessSettings();

    const whatsappUrl =
        settings.whatsappNumber
            ? createWhatsappUrl(
                settings.whatsappNumber,
                `Hi ${settings.businessName}, saya nak tanya mengenai produk anda.`
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
        <main className="min-h-screen bg-rose-50">
            <Navbar
                businessName={
                    settings.businessName
                }
            />

            <section className="px-6 py-16">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center">
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                            Contact Us
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
                            Get In Touch
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                            Ada pertanyaan mengenai
                            produk, tempahan atau
                            delivery? Hubungi{" "}
                            {settings.businessName}{" "}
                            melalui platform di bawah.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        {whatsappUrl && (
                            <ContactCard
                                title="WhatsApp"
                                value={
                                    settings.whatsappNumber ??
                                    ""
                                }
                                href={
                                    whatsappUrl
                                }
                            />
                        )}

                        {settings.contactEmail && (
                            <ContactCard
                                title="Email"
                                value={
                                    settings.contactEmail
                                }
                                href={`mailto:${settings.contactEmail}`}
                            />
                        )}

                        {settings.businessAddress && (
                            <div className="rounded-2xl border border-rose-100 bg-white p-6">
                                <p className="text-sm font-medium uppercase tracking-wide text-rose-500">
                                    Address
                                </p>

                                <p className="mt-3 whitespace-pre-line text-gray-700">
                                    {
                                        settings.businessAddress
                                    }
                                </p>
                            </div>
                        )}

                        {instagramUrl && (
                            <ContactCard
                                title="Instagram"
                                value={`@${settings.instagramHandle?.replace(
                                    /^@/,
                                    ""
                                )}`}
                                href={
                                    instagramUrl
                                }
                            />
                        )}

                        {tiktokUrl && (
                            <ContactCard
                                title="TikTok"
                                value={`@${settings.tiktokHandle?.replace(
                                    /^@/,
                                    ""
                                )}`}
                                href={
                                    tiktokUrl
                                }
                            />
                        )}
                    </div>

                    {(settings.deliveryInfo ||
                        settings.postageInfo) && (
                            <div className="mt-10 rounded-2xl border border-rose-100 bg-white p-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Delivery & Postage
                                </h2>

                                <div className="mt-5 space-y-5 text-sm leading-6 text-gray-600">
                                    {settings.deliveryInfo && (
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Delivery
                                            </p>

                                            <p className="mt-1 whitespace-pre-line">
                                                {
                                                    settings.deliveryInfo
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {settings.postageInfo && (
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Postage
                                            </p>

                                            <p className="mt-1 whitespace-pre-line">
                                                {
                                                    settings.postageInfo
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                </div>
            </section>
        </main>
    );
}

type ContactCardProps = {
    title: string;
    value: string;
    href: string;
};

function ContactCard({
    title,
    value,
    href,
}: ContactCardProps) {
    return (
        <a
            href={href}
            target={
                href.startsWith("http")
                    ? "_blank"
                    : undefined
            }
            rel={
                href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
            }
            className="rounded-2xl border border-rose-100 bg-white p-6 transition hover:border-rose-200 hover:shadow-sm"
        >
            <p className="text-sm font-medium uppercase tracking-wide text-rose-500">
                {title}
            </p>

            <p className="mt-3 font-medium text-gray-900">
                {value}
            </p>

            <p className="mt-4 text-sm font-medium text-rose-500">
                Contact →
            </p>
        </a>
    );
}
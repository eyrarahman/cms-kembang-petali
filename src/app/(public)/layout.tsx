import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { getBusinessSettings } from "@/features/settings/services/settings.service";

export async function generateMetadata(): Promise<Metadata> {
    const settings =
        await getBusinessSettings();

    return {
        title: {
            default: settings.businessName,
            template: `%s | ${settings.businessName}`,
        },

        description:
            `${settings.businessName} offers bouquets, gifts and floral arrangements for your special moments.`,
    };
}

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="flex-1">
                {children}
            </div>

            <Footer />
        </>
    );
}
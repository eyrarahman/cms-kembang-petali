import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { getBusinessSettings } from "@/features/settings/services/settings.service";

type AdminProtectedLayoutProps = {
    children: ReactNode;
};

export default async function AdminProtectedLayout({
    children,
}: AdminProtectedLayoutProps) {
    const supabase = await createClient();

    const { data, error } =
        await supabase.auth.getClaims();

    const userId = data?.claims?.sub;

    if (error || !userId) {
        redirect("/admin/login");
    }

    const settings =
        await getBusinessSettings();

    return (
        <div className="flex min-h-screen bg-rose-50">
            <AdminSidebar
                businessName={
                    settings.businessName
                }
            />

            <div className="min-w-0 flex-1 overflow-x-hidden">
                {children}
            </div>
        </div>
    );
}
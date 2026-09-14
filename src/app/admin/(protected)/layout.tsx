import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/layout/AdminSidebar";

import { getBusinessSettings } from "@/features/settings/services/settings.service";
import { createClient } from "@/lib/supabase/server";

type AdminProtectedLayoutProps = {
    children: ReactNode;
};

export default async function AdminProtectedLayout({
    children,
}: AdminProtectedLayoutProps) {
    const supabase =
        await createClient();

    const { data, error } =
        await supabase.auth.getClaims();

    const userId =
        data?.claims?.sub;

    if (error || !userId) {
        redirect("/admin/login");
    }

    const {
        data: isAdmin,
        error: adminError,
    } = await supabase.rpc(
        "is_admin"
    );

    if (
        adminError ||
        !isAdmin
    ) {
        redirect(
            "/admin/unauthorized"
        );
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
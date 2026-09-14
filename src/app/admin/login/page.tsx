import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm";
import { getBusinessSettings } from "@/features/settings/services/settings.service";

export default async function AdminLoginPage() {
    const settings =
        await getBusinessSettings();

    return (
        <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6">
            <AdminLoginForm
                businessName={
                    settings.businessName
                }
            />
        </main>
    );
}
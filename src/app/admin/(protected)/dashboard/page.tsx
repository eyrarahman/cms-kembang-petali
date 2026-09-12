import { AdminDashboardScreen } from "@/features/dashboard/components/AdminDashboardScreen";

import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import { getBusinessSettings } from "@/features/settings/services/settings.service";

export default async function AdminDashboardPage() {
    const [
        data,
        settings,
    ] = await Promise.all([
        getDashboardData(),
        getBusinessSettings(),
    ]);

    return (
        <AdminDashboardScreen
            data={data}
            businessName={
                settings.businessName
            }
        />
    );
}
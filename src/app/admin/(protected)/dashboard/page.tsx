import { AdminDashboardScreen } from "@/features/dashboard/components/AdminDashboardScreen";

import { getDashboardData } from "@/features/dashboard/services/dashboard.service";

export default async function AdminDashboardPage() {
    const data =
        await getDashboardData();

    return (
        <AdminDashboardScreen
            data={data}
        />
    );
}
import { AdminCapacityScreen } from "@/features/capacity/components/AdminCapacityScreen";

import {
    getCapacityOverrides,
    getCapacitySettings,
} from "@/features/capacity/services/capacity.service";

export default async function AdminCapacityPage() {
    const [
        settings,
        overrides,
    ] = await Promise.all([
        getCapacitySettings(),
        getCapacityOverrides(),
    ]);

    return (
        <AdminCapacityScreen
            settings={settings}
            overrides={overrides}
        />
    );
}
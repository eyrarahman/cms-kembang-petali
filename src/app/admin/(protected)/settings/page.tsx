import { AdminSettingsForm } from "@/features/settings/components/AdminSettingsForm";

import { getBusinessSettings } from "@/features/settings/services/settings.service";

import { saveBusinessSettings } from "./actions";

export default async function AdminSettingsPage() {
    const settings =
        await getBusinessSettings();

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-5xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Configuration
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Settings
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Manage business
                        information and
                        default order
                        settings.
                    </p>
                </div>

                <div className="mt-8">
                    <AdminSettingsForm
                        settings={
                            settings
                        }
                        onSave={
                            saveBusinessSettings
                        }
                    />
                </div>
            </div>
        </main>
    );
}
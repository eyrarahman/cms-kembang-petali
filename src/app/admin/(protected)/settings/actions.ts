"use server";

import { revalidatePath } from "next/cache";

import { updateBusinessSettings } from "@/features/settings/services/settings.service";

import { BusinessSettingsInput } from "@/features/settings/types/settings.types";

export async function saveBusinessSettings(
    input: BusinessSettingsInput
) {
    await updateBusinessSettings(
        input
    );

    revalidatePath(
        "/admin/settings"
    );
}
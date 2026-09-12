import { createClient } from "@/lib/supabase/server";

import { BusinessSettingsInput } from "../types/settings.types";

export async function getBusinessSettingsFromDatabase() {
    const supabase =
        await createClient();

    const {
        data,
        error,
    } = await supabase
        .from(
            "business_settings"
        )
        .select(`
            business_name,
            whatsapp_number,
            contact_email,
            business_address,
            instagram_handle,
            tiktok_handle,
            default_prep_days,
            delivery_info,
            postage_info
        `)
        .eq(
            "id",
            1
        )
        .single();

    if (error) {
        throw new Error(
            error.message
        );
    }

    return data;
}

export async function updateBusinessSettingsInDatabase(
    input: BusinessSettingsInput
) {
    const supabase =
        await createClient();

    const {
        data,
        error,
    } = await supabase
        .from(
            "business_settings"
        )
        .update({
            business_name:
                input.businessName,

            whatsapp_number:
                input.whatsappNumber ||
                null,

            contact_email:
                input.contactEmail ||
                null,

            business_address:
                input.businessAddress ||
                null,

            instagram_handle:
                input.instagramHandle ||
                null,

            tiktok_handle:
                input.tiktokHandle ||
                null,

            default_prep_days:
                input.defaultPrepDays,

            delivery_info:
                input.deliveryInfo ||
                null,

            postage_info:
                input.postageInfo ||
                null,

            updated_at:
                new Date().toISOString(),
        })
        .eq(
            "id",
            1
        )
        .select()
        .single();

    if (error) {
        throw new Error(
            error.message
        );
    }

    return data;
}
import {
    getBusinessSettingsFromDatabase,
    updateBusinessSettingsInDatabase,
} from "../repositories/settings.repository";

import {
    BusinessSettings,
    BusinessSettingsInput,
} from "../types/settings.types";

function normalizeOptionalText(
    value: string | null
) {
    return value ?? undefined;
}

function normalizeWhatsappNumber(
    value: string
) {
    return value
        .replace(/\s/g, "")
        .replace(/-/g, "")
        .replace(/[()]/g, "")
        .replace(/^\+/, "");
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
    const data =
        await getBusinessSettingsFromDatabase();

    return {
        businessName:
            data.business_name,

        whatsappNumber:
            normalizeOptionalText(
                data.whatsapp_number
            ),

        contactEmail:
            normalizeOptionalText(
                data.contact_email
            ),

        businessAddress:
            normalizeOptionalText(
                data.business_address
            ),

        instagramHandle:
            normalizeOptionalText(
                data.instagram_handle
            ),

        tiktokHandle:
            normalizeOptionalText(
                data.tiktok_handle
            ),

        defaultPrepDays:
            Number(
                data.default_prep_days
            ),

        deliveryInfo:
            normalizeOptionalText(
                data.delivery_info
            ),

        postageInfo:
            normalizeOptionalText(
                data.postage_info
            ),
    };
}

export async function updateBusinessSettings(
    input: BusinessSettingsInput
) {
    const businessName =
        input.businessName.trim();

    if (!businessName) {
        throw new Error(
            "Business name is required."
        );
    }

    if (
        input.defaultPrepDays < 0 ||
        input.defaultPrepDays > 30
    ) {
        throw new Error(
            "Default prep days must be between 0 and 30."
        );
    }

    let whatsappNumber =
        input.whatsappNumber.trim();

    if (whatsappNumber) {
        whatsappNumber =
            normalizeWhatsappNumber(
                whatsappNumber
            );

        if (
            !/^\d{8,15}$/.test(
                whatsappNumber
            )
        ) {
            throw new Error(
                "Please enter a valid WhatsApp number."
            );
        }
    }

    const cleanedInput: BusinessSettingsInput =
        {
            businessName,

            whatsappNumber,

            contactEmail:
                input.contactEmail.trim(),

            businessAddress:
                input.businessAddress.trim(),

            instagramHandle:
                input.instagramHandle.trim(),

            tiktokHandle:
                input.tiktokHandle.trim(),

            defaultPrepDays:
                input.defaultPrepDays,

            deliveryInfo:
                input.deliveryInfo.trim(),

            postageInfo:
                input.postageInfo.trim(),
        };

    await updateBusinessSettingsInDatabase(
        cleanedInput
    );

    return getBusinessSettings();
}
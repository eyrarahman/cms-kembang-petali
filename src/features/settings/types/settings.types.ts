export type BusinessSettings = {
    businessName: string;

    whatsappNumber?: string;

    contactEmail?: string;

    businessAddress?: string;

    instagramHandle?: string;

    tiktokHandle?: string;

    defaultPrepDays: number;

    deliveryInfo?: string;

    postageInfo?: string;
};

export type BusinessSettingsInput = {
    businessName: string;

    whatsappNumber: string;

    contactEmail: string;

    businessAddress: string;

    instagramHandle: string;

    tiktokHandle: string;

    defaultPrepDays: number;

    deliveryInfo: string;

    postageInfo: string;
};
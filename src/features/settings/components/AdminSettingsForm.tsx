"use client";

import {
    FormEvent,
    useState,
} from "react";

import {
    BusinessSettings,
    BusinessSettingsInput,
} from "../types/settings.types";

type AdminSettingsFormProps = {
    settings: BusinessSettings;

    onSave: (
        input: BusinessSettingsInput
    ) => Promise<void>;
};

export function AdminSettingsForm({
    settings,
    onSave,
}: AdminSettingsFormProps) {
    const [
        businessName,
        setBusinessName,
    ] = useState(
        settings.businessName
    );

    const [
        whatsappNumber,
        setWhatsappNumber,
    ] = useState(
        settings.whatsappNumber ?? ""
    );

    const [
        contactEmail,
        setContactEmail,
    ] = useState(
        settings.contactEmail ?? ""
    );

    const [
        businessAddress,
        setBusinessAddress,
    ] = useState(
        settings.businessAddress ?? ""
    );

    const [
        instagramHandle,
        setInstagramHandle,
    ] = useState(
        settings.instagramHandle ?? ""
    );

    const [
        tiktokHandle,
        setTiktokHandle,
    ] = useState(
        settings.tiktokHandle ?? ""
    );

    const [
        defaultPrepDays,
        setDefaultPrepDays,
    ] = useState(
        settings.defaultPrepDays
    );

    const [
        deliveryInfo,
        setDeliveryInfo,
    ] = useState(
        settings.deliveryInfo ?? ""
    );

    const [
        postageInfo,
        setPostageInfo,
    ] = useState(
        settings.postageInfo ?? ""
    );

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setError("");
        setIsSaving(true);

        try {
            await onSave({
                businessName,
                whatsappNumber,
                contactEmail,
                businessAddress,
                instagramHandle,
                tiktokHandle,
                defaultPrepDays,
                deliveryInfo,
                postageInfo,
            });

            setMessage(
                "Settings updated successfully."
            );
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Unable to update settings."
                );
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form
            onSubmit={
                handleSubmit
            }
            className="space-y-6"
        >
            <SettingsSection
                title="Business Information"
                description="Basic information displayed across Kembang Petali."
            >
                <Field
                    label="Business Name"
                    required
                >
                    <input
                        value={
                            businessName
                        }
                        onChange={(
                            event
                        ) =>
                            setBusinessName(
                                event
                                    .target
                                    .value
                            )
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rose-300"
                    />
                </Field>

                <Field label="WhatsApp Number">
                    <input
                        value={
                            whatsappNumber
                        }
                        onChange={(
                            event
                        ) =>
                            setWhatsappNumber(
                                event
                                    .target
                                    .value
                            )
                        }
                        placeholder="60123456789"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rose-300"
                    />

                    <p className="mt-2 text-xs text-gray-400">
                        Example:
                        60123456789
                    </p>
                </Field>

                <Field label="Contact Email">
                    <input
                        type="email"
                        value={
                            contactEmail
                        }
                        onChange={(
                            event
                        ) =>
                            setContactEmail(
                                event
                                    .target
                                    .value
                            )
                        }
                        placeholder="hello@example.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rose-300"
                    />
                </Field>

                <Field label="Business Address">
                    <textarea
                        value={
                            businessAddress
                        }
                        onChange={(
                            event
                        ) =>
                            setBusinessAddress(
                                event
                                    .target
                                    .value
                            )
                        }
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rose-300"
                    />
                </Field>
            </SettingsSection>

            <SettingsSection
                title="Social Media"
                description="Social media handles used on the public website."
            >
                <Field label="Instagram Handle">
                    <input
                        value={
                            instagramHandle
                        }
                        onChange={(
                            event
                        ) =>
                            setInstagramHandle(
                                event
                                    .target
                                    .value
                            )
                        }
                        placeholder="kembang.petali"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rose-300"
                    />
                </Field>

                <Field label="TikTok Handle">
                    <input
                        value={
                            tiktokHandle
                        }
                        onChange={(
                            event
                        ) =>
                            setTiktokHandle(
                                event
                                    .target
                                    .value
                            )
                        }
                        placeholder="kembang.petali"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rose-300"
                    />
                </Field>
            </SettingsSection>

            <SettingsSection
                title="Order Settings"
                description="Default values used when creating orders."
            >
                <Field label="Default Prep Days">
                    <input
                        type="number"
                        min={0}
                        max={30}
                        value={
                            defaultPrepDays
                        }
                        onChange={(
                            event
                        ) =>
                            setDefaultPrepDays(
                                Number(
                                    event
                                        .target
                                        .value
                                )
                            )
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rose-300"
                    />
                </Field>

                <Field label="Delivery Information">
                    <textarea
                        value={
                            deliveryInfo
                        }
                        onChange={(
                            event
                        ) =>
                            setDeliveryInfo(
                                event
                                    .target
                                    .value
                            )
                        }
                        rows={4}
                        placeholder="Delivery coverage, charges or notes..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rose-300"
                    />
                </Field>

                <Field label="Postage Information">
                    <textarea
                        value={
                            postageInfo
                        }
                        onChange={(
                            event
                        ) =>
                            setPostageInfo(
                                event
                                    .target
                                    .value
                            )
                        }
                        rows={4}
                        placeholder="Postage coverage, lead time or notes..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-rose-300"
                    />
                </Field>
            </SettingsSection>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {message && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {message}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={
                        isSaving
                    }
                    className="rounded-xl bg-rose-500 px-6 py-3 text-sm font-medium text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving
                        ? "Saving..."
                        : "Save Settings"}
                </button>
            </div>
        </form>
    );
}

type SettingsSectionProps = {
    title: string;
    description: string;
    children: React.ReactNode;
};

function SettingsSection({
    title,
    description,
    children,
}: SettingsSectionProps) {
    return (
        <section className="rounded-2xl border border-rose-100 bg-white p-6">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {children}
            </div>
        </section>
    );
}

type FieldProps = {
    label: string;
    required?: boolean;
    children: React.ReactNode;
};

function Field({
    label,
    required = false,
    children,
}: FieldProps) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}
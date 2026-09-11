"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    deleteCapacityOverride,
    saveCapacityOverride,
    updateDefaultCapacity,
} from "../services/capacity-admin.service";

import {
    CapacityOverride,
    CapacitySettings,
} from "../types/capacity.types";

type AdminCapacityScreenProps = {
    settings: CapacitySettings;

    overrides: CapacityOverride[];
};

function formatDate(
    value: string
) {
    return new Intl.DateTimeFormat(
        "en-MY",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(
        new Date(
            `${value}T00:00:00`
        )
    );
}

export function AdminCapacityScreen({
    settings,
    overrides,
}: AdminCapacityScreenProps) {
    const router = useRouter();

    const [
        defaultCapacity,
        setDefaultCapacity,
    ] = useState(
        String(
            settings.defaultDailyCapacity
        )
    );

    const [
        capacityDate,
        setCapacityDate,
    ] = useState("");

    const [
        capacity,
        setCapacity,
    ] = useState(
        String(
            settings.defaultDailyCapacity
        )
    );

    const [
        isBlocked,
        setIsBlocked,
    ] = useState(false);

    const [notes, setNotes] =
        useState("");

    const [
        isSavingDefault,
        setIsSavingDefault,
    ] = useState(false);

    const [
        isSavingOverride,
        setIsSavingOverride,
    ] = useState(false);

    const [error, setError] =
        useState("");

    async function handleSaveDefault(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        try {
            setError("");
            setIsSavingDefault(true);

            await updateDefaultCapacity(
                Number(
                    defaultCapacity
                )
            );

            router.refresh();
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Unable to update default capacity."
                );
            }
        } finally {
            setIsSavingDefault(false);
        }
    }

    async function handleSaveOverride(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        try {
            setError("");
            setIsSavingOverride(true);

            await saveCapacityOverride({
                capacityDate,

                capacity:
                    Number(capacity),

                isBlocked,

                notes,
            });

            setCapacityDate("");

            setCapacity(
                String(
                    settings.defaultDailyCapacity
                )
            );

            setIsBlocked(false);
            setNotes("");

            router.refresh();
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Unable to save capacity override."
                );
            }
        } finally {
            setIsSavingOverride(false);
        }
    }

    async function handleDelete(
        override: CapacityOverride
    ) {
        const confirmed =
            window.confirm(
                `Remove capacity override for ${formatDate(
                    override.capacityDate
                )}?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteCapacityOverride(
                override.id
            );

            router.refresh();
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Unable to delete capacity override."
                );
            }
        }
    }

    return (
        <main className="px-8 py-12 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
                        Capacity Management
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Capacity
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Manage daily order
                        capacity and special
                        date overrides.
                    </p>
                </div>

                {error && (
                    <div className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* DEFAULT */}
                <section className="mt-10 rounded-2xl border border-rose-100 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Default Daily Capacity
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        This capacity will be
                        used unless a specific
                        date has an override.
                    </p>

                    <form
                        onSubmit={
                            handleSaveDefault
                        }
                        className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Orders Per Day
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={
                                    defaultCapacity
                                }
                                onChange={(
                                    event
                                ) =>
                                    setDefaultCapacity(
                                        event.target
                                            .value
                                    )
                                }
                                className="w-48 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={
                                isSavingDefault
                            }
                            className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
                        >
                            {isSavingDefault
                                ? "Saving..."
                                : "Save Default"}
                        </button>
                    </form>
                </section>

                {/* OVERRIDE FORM */}
                <section className="mt-6 rounded-2xl border border-rose-100 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Add Date Override
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Set a different
                        capacity or completely
                        block a specific date.
                    </p>

                    <form
                        onSubmit={
                            handleSaveOverride
                        }
                        className="mt-6"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        capacityDate
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setCapacityDate(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Capacity
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={
                                        capacity
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setCapacity(
                                            event.target
                                                .value
                                        )
                                    }
                                    disabled={
                                        isBlocked
                                    }
                                    required={
                                        !isBlocked
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-400 disabled:bg-gray-100 disabled:text-gray-400"
                                />
                            </div>
                        </div>

                        <label className="mt-6 flex cursor-pointer items-center gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    isBlocked
                                }
                                onChange={(
                                    event
                                ) =>
                                    setIsBlocked(
                                        event.target
                                            .checked
                                    )
                                }
                                className="h-4 w-4"
                            />

                            <span className="text-sm font-medium text-gray-700">
                                Block this date
                                completely
                            </span>
                        </label>

                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Notes
                            </label>

                            <textarea
                                rows={3}
                                value={notes}
                                onChange={(
                                    event
                                ) =>
                                    setNotes(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Example: Personal leave, event, reduced production..."
                                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={
                                isSavingOverride
                            }
                            className="mt-6 rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
                        >
                            {isSavingOverride
                                ? "Saving..."
                                : "Save Override"}
                        </button>
                    </form>
                </section>

                {/* OVERRIDES LIST */}
                <section className="mt-6 overflow-hidden rounded-2xl border border-rose-100 bg-white">
                    <div className="border-b border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Date Overrides
                        </h2>
                    </div>

                    {overrides.length ===
                        0 ? (
                        <div className="p-10 text-center text-sm text-gray-500">
                            No capacity overrides
                            yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                            Capacity
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                            Notes
                                        </th>

                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {overrides.map(
                                        (override) => (
                                            <tr
                                                key={
                                                    override.id
                                                }
                                            >
                                                <td className="px-6 py-5 font-medium text-gray-900">
                                                    {formatDate(
                                                        override.capacityDate
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {override.isBlocked ? (
                                                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                                                            Blocked
                                                        </span>
                                                    ) : (
                                                        <span className="font-medium text-gray-900">
                                                            {
                                                                override.capacity
                                                            }{" "}
                                                            orders
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-500">
                                                    {override.notes ??
                                                        "—"}
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                override
                                                            )
                                                        }
                                                        className="text-sm font-medium text-red-500 hover:text-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
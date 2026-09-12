import { AdminCalendarScreen } from "@/features/calendar/components/AdminCalendarScreen";

import { getCalendarEvents } from "@/features/calendar/services/calendar.service";

import { getCalendarMonthInfo } from "@/features/calendar/utils/calendar.utils";
import {
    getCapacityOverrides,
    getCapacitySettings,
} from "@/features/capacity/services/capacity.service";

type AdminCalendarPageProps = {
    searchParams: Promise<{
        month?: string;
    }>;
};

export default async function AdminCalendarPage({
    searchParams,
}: AdminCalendarPageProps) {
    const params =
        await searchParams;

    const month =
        getCalendarMonthInfo(
            params.month
        );

    const [
        events,
        capacitySettings,
        capacityOverrides,
    ] = await Promise.all([
        getCalendarEvents(
            month.gridStartDate,
            month.gridEndDate
        ),

        getCapacitySettings(),

        getCapacityOverrides(),
    ]);

    const todayFormatter =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    "Asia/Kuala_Lumpur",

                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }
        );

    const todayDate =
        todayFormatter.format(
            new Date()
        );

    return (
        <AdminCalendarScreen
            events={events}
            month={month}
            capacitySettings={
                capacitySettings
            }
            capacityOverrides={
                capacityOverrides
            }
            todayDate={
                todayDate
            }
        />
    );
}
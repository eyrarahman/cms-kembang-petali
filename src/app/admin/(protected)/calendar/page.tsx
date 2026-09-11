import { AdminCalendarScreen } from "@/features/calendar/components/AdminCalendarScreen";

import { getCalendarEvents } from "@/features/calendar/services/calendar.service";

import { getCalendarMonthInfo } from "@/features/calendar/utils/calendar.utils";

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

    const events =
        await getCalendarEvents(
            month.gridStartDate,
            month.gridEndDate
        );

    return (
        <AdminCalendarScreen
            events={events}
            month={month}
        />
    );
}
import {
    mapCapacityOverrideToCalendarEvent,
    mapOrderToCalendarEvents,
} from "../mappers/calendar.mapper";

import {
    getCalendarCapacityOverridesFromDatabase,
    getCalendarOrdersFromDatabase,
} from "../repositories/calendar.repository";

import { CalendarEvent } from "../types/calendar.types";

export async function getCalendarEvents(
    startDate: string,
    endDate: string
): Promise<CalendarEvent[]> {
    const [
        orders,
        overrides,
    ] = await Promise.all([
        getCalendarOrdersFromDatabase(
            startDate,
            endDate
        ),

        getCalendarCapacityOverridesFromDatabase(
            startDate,
            endDate
        ),
    ]);

    const orderEvents =
        orders.flatMap(
            mapOrderToCalendarEvents
        );

    const capacityEvents =
        overrides
            .map(
                mapCapacityOverrideToCalendarEvent
            )
            .filter(
                (
                    event
                ): event is CalendarEvent =>
                    event !== null
            );

    return [
        ...orderEvents,
        ...capacityEvents,
    ].sort(
        (a, b) =>
            a.date.localeCompare(
                b.date
            )
    );
}
import {
    CalendarEvent,
    CalendarEventType,
} from "../types/calendar.types";

type CustomerRelation = {
    name: string;
};

type CalendarOrderDatabaseRow = {
    id: string;
    order_code: string;
    status: string;

    fulfillment_type: string;
    fulfillment_date: string;
    production_start_date:
        | string
        | null;

    customers:
        | CustomerRelation
        | CustomerRelation[]
        | null;
};

type CapacityOverrideDatabaseRow = {
    id: string;

    capacity_date: string;
    capacity: number;

    is_blocked: boolean;

    notes: string | null;
};

function getCustomerName(
    relation:
        | CustomerRelation
        | CustomerRelation[]
        | null
) {
    if (!relation) {
        return undefined;
    }

    if (
        Array.isArray(relation)
    ) {
        return relation[0]?.name;
    }

    return relation.name;
}

export function mapOrderToCalendarEvents(
    order: CalendarOrderDatabaseRow
): CalendarEvent[] {
    const events:
        CalendarEvent[] = [];

    const customerName =
        getCustomerName(
            order.customers
        );

    if (
        order.production_start_date
    ) {
        events.push({
            id: `production-${order.id}`,

            date:
                order.production_start_date,

            type: "production",

            title:
                `Start ${order.order_code}`,

            orderId:
                order.id,

            orderCode:
                order.order_code,

            customerName,
        });
    }

    events.push({
        id: `fulfillment-${order.id}`,

        date:
            order.fulfillment_date,

        type:
            order.fulfillment_type as
                | "delivery"
                | "postage"
                | "pickup",

        title:
            `${getFulfillmentLabel(
                order.fulfillment_type
            )} ${order.order_code}`,

        orderId:
            order.id,

        orderCode:
            order.order_code,

        customerName,
    });

    return events;
}

export function mapCapacityOverrideToCalendarEvent(
    override: CapacityOverrideDatabaseRow
): CalendarEvent | null {
    if (!override.is_blocked) {
        return null;
    }

    return {
        id:
            `blocked-${override.id}`,

        date:
            override.capacity_date,

        type: "blocked",

        title:
            "Blocked Date",

        notes:
            override.notes ??
            undefined,
    };
}

function getFulfillmentLabel(
    type: string
): string {
    const labels: Record<
        string,
        string
    > = {
        delivery:
            "Delivery",

        postage:
            "Postage",

        pickup:
            "Pickup",
    };

    return (
        labels[type] ??
        "Fulfilment"
    );
}
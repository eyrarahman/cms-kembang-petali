export type CalendarEventType =
    | "production"
    | "delivery"
    | "postage"
    | "pickup"
    | "blocked";

export type CalendarEvent = {
    id: string;

    date: string;

    type: CalendarEventType;

    title: string;

    orderId?: string;
    orderCode?: string;

    customerName?: string;

    notes?: string;
};
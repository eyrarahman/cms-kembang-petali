import {
    FulfillmentType,
    OrderStatus,
} from "@/features/orders/types/order.types";

export type DashboardOrderItem = {
    id: string;

    orderCode: string;

    customerName: string;

    fulfillmentDate: string;

    fulfillmentType: FulfillmentType;

    status: OrderStatus;

    totalAmount: number;
    amountPaid: number;
    balanceAmount: number;
};

export type DashboardProductionItem = {
    id: string;

    orderCode: string;

    customerName: string;

    fulfillmentDate: string;

    fulfillmentType: FulfillmentType;

    status: OrderStatus;
};

export type DashboardCapacity = {
    capacity: number;

    bookedOrders: number;

    availableSlots: number;

    isBlocked: boolean;

    isFull: boolean;

    notes?: string;
};

export type DashboardData = {
    date: string;

    pendingOrders: number;

    todayProductionCount: number;

    todayFulfillmentCount: number;

    outstandingPayment: number;

    todayCapacity: DashboardCapacity;

    upcomingFulfillments: DashboardOrderItem[];

    todayProduction: DashboardProductionItem[];
    overdueFulfillments: number;

    overduePayments: number;
    todayFulfillmentValue: number;

    recentOrders: DashboardOrderItem[];
};
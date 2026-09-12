import {
    mapProductionOrder,
    mapUpcomingOrder,
} from "../mappers/dashboard.mapper";

import { getDashboardDataFromDatabase } from "../repositories/dashboard.repository";

import { DashboardData } from "../types/dashboard.types";

function getMalaysiaTodayDate() {
    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone:
                "Asia/Kuala_Lumpur",

            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).format(
        new Date()
    );
}

export async function getDashboardData(): Promise<DashboardData> {
    const todayDate =
        getMalaysiaTodayDate();

    const data =
        await getDashboardDataFromDatabase(
            todayDate
        );

    // Outstanding payment
    const outstandingPayment =
        data.paymentOrders.reduce(
            (
                total,
                order
            ) => {
                const balance =
                    Math.max(
                        Number(
                            order.total_amount
                        ) -
                        Number(
                            order.amount_paid
                        ),
                        0
                    );

                return (
                    total +
                    balance
                );
            },
            0
        );

    const todayFulfillmentValue =
        data.todayValueOrders.reduce(
            (
                total,
                order
            ) =>
                total +
                Number(
                    order.total_amount
                ),
            0
        );

    // Capacity
    const defaultCapacity =
        Number(
            data.capacitySettings
                ?.default_daily_capacity ??
            5
        );

    const isBlocked =
        data.capacityOverride
            ?.is_blocked ??
        false;

    const capacity =
        isBlocked
            ? 0
            : Number(
                data.capacityOverride
                    ?.capacity ??
                defaultCapacity
            );

    const bookedOrders =
        data.capacityBookedOrders;

    const availableSlots =
        Math.max(
            capacity -
            bookedOrders,
            0
        );

    const todayCapacity = {
        capacity,

        bookedOrders,

        availableSlots,

        isBlocked,

        isFull:
            !isBlocked &&
            availableSlots <= 0,

        notes:
            data.capacityOverride
                ?.notes ??
            undefined,
    };

    return {
        date:
            todayDate,

        pendingOrders:
            data.pendingOrders,

        todayProductionCount:
            data.productionOrders.length,

        todayFulfillmentCount:
            data.todayFulfillmentCount,

        outstandingPayment,

        todayCapacity,

        upcomingFulfillments:
            data.upcomingOrders.map(
                mapUpcomingOrder
            ),

        todayProduction:
            data.productionOrders.map(
                mapProductionOrder
            ),

        overdueFulfillments:
            data.overdueFulfillments,

        overduePayments:
            data.overduePayments,

        todayFulfillmentValue,

        recentOrders:
            data.recentOrders.map(
                mapUpcomingOrder
            ),
    };
}
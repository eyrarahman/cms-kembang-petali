import { createClient } from "@/lib/supabase/server";

export async function getDashboardDataFromDatabase(
    todayDate: string
) {
    const supabase =
        await createClient();

    const [
        pendingResult,
        productionResult,
        fulfillmentResult,
        paymentResult,
        upcomingResult,
        settingsResult,
        overrideResult,
        capacityOrdersResult,
        overdueFulfillmentResult,
        overduePaymentResult,
        todayValueResult,
        recentOrdersResult,
    ] = await Promise.all([
        // Pending orders
        supabase
            .from("orders")
            .select(
                "id",
                {
                    count: "exact",
                    head: true,
                }
            )
            .eq(
                "status",
                "pending"
            ),

        // Today's production
        supabase
            .from("orders")
            .select(`
                id,
                order_code,
                fulfillment_date,
                fulfillment_type,
                status,

                customers (
                    name
                )
            `)
            .eq(
                "production_start_date",
                todayDate
            )
            .neq(
                "status",
                "cancelled"
            )
            .order(
                "fulfillment_date",
                {
                    ascending: true,
                }
            ),

        // Today's fulfilment
        supabase
            .from("orders")
            .select(
                "id",
                {
                    count: "exact",
                    head: true,
                }
            )
            .eq(
                "fulfillment_date",
                todayDate
            )
            .neq(
                "status",
                "cancelled"
            ),

        // Outstanding payments
        supabase
            .from("orders")
            .select(`
                total_amount,
                amount_paid,
                payment_status,
                status
            `)
            .in(
                "payment_status",
                [
                    "unpaid",
                    "partial",
                ]
            )
            .neq(
                "status",
                "cancelled"
            ),

        // Upcoming fulfilments
        supabase
            .from("orders")
            .select(`
                id,
                order_code,
                fulfillment_date,
                fulfillment_type,
                status,
                total_amount,
                amount_paid,

                customers (
                    name
                )
            `)
            .gte(
                "fulfillment_date",
                todayDate
            )
            .in(
                "status",
                [
                    "pending",
                    "confirmed",
                    "preparing",
                    "ready",
                ]
            )
            .order(
                "fulfillment_date",
                {
                    ascending: true,
                }
            )
            .limit(8),

        // Default capacity
        supabase
            .from(
                "capacity_settings"
            )
            .select(`
                default_daily_capacity
            `)
            .eq("id", 1)
            .maybeSingle(),

        // Today's override
        supabase
            .from(
                "capacity_overrides"
            )
            .select(`
                capacity,
                is_blocked,
                notes
            `)
            .eq(
                "capacity_date",
                todayDate
            )
            .maybeSingle(),

        // Today's booked orders
        supabase
            .from("orders")
            .select(
                "id",
                {
                    count: "exact",
                    head: true,
                }
            )
            .eq(
                "fulfillment_date",
                todayDate
            )
            .neq(
                "status",
                "cancelled"
            ),

        // Overdue fulfilments
        supabase
            .from("orders")
            .select(
                "id",
                {
                    count: "exact",
                    head: true,
                }
            )
            .lt(
                "fulfillment_date",
                todayDate
            )
            .in(
                "status",
                [
                    "pending",
                    "confirmed",
                    "preparing",
                    "ready",
                ]
            ),

        // Overdue payments
        supabase
            .from("orders")
            .select(
                "id",
                {
                    count: "exact",
                    head: true,
                }
            )
            .lt(
                "fulfillment_date",
                todayDate
            )
            .in(
                "payment_status",
                [
                    "unpaid",
                    "partial",
                ]
            )
            .neq(
                "status",
                "cancelled"
            ),

        // Today's fulfilment value
        supabase
            .from("orders")
            .select(`
        total_amount
    `)
            .eq(
                "fulfillment_date",
                todayDate
            )
            .neq(
                "status",
                "cancelled"
            ),

        // Recent orders
        supabase
            .from("orders")
            .select(`
        id,
        order_code,
        fulfillment_date,
        fulfillment_type,
        status,
        total_amount,
        amount_paid,
        created_at,

        customers (
            name
        )
    `)
            .order(
                "created_at",
                {
                    ascending: false,
                }
            )
            .limit(5),
    ]);

    const results = [
        pendingResult,
        productionResult,
        fulfillmentResult,
        paymentResult,
        upcomingResult,
        settingsResult,
        overrideResult,
        capacityOrdersResult,
        overdueFulfillmentResult,
        overduePaymentResult,
        todayValueResult,
        recentOrdersResult,
    ];

    const failedResult =
        results.find(
            (result) =>
                result.error
        );

    if (failedResult?.error) {
        throw new Error(
            failedResult.error.message
        );
    }

    return {
        pendingOrders:
            pendingResult.count ?? 0,

        productionOrders:
            productionResult.data ?? [],

        todayFulfillmentCount:
            fulfillmentResult.count ?? 0,

        paymentOrders:
            paymentResult.data ?? [],

        upcomingOrders:
            upcomingResult.data ?? [],

        capacitySettings:
            settingsResult.data,

        capacityOverride:
            overrideResult.data,

        capacityBookedOrders:
            capacityOrdersResult.count ??
            0,

        overdueFulfillments:
            overdueFulfillmentResult.count ??
            0,

        overduePayments:
            overduePaymentResult.count ??
            0,

        todayValueOrders:
            todayValueResult.data ?? [],

        recentOrders:
            recentOrdersResult.data ?? [],
    };
}
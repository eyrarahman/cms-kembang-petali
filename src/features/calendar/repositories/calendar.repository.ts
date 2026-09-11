import { createClient } from "@/lib/supabase/server";

export async function getCalendarOrdersFromDatabase(
    startDate: string,
    endDate: string
) {
    const supabase =
        await createClient();

    const { data, error } =
        await supabase
            .from("orders")
            .select(`
                id,
                order_code,
                status,

                fulfillment_type,
                fulfillment_date,
                production_start_date,

                customers (
                    name
                )
            `)
            .neq(
                "status",
                "cancelled"
            )
            .or(
                `and(fulfillment_date.gte.${startDate},fulfillment_date.lte.${endDate}),and(production_start_date.gte.${startDate},production_start_date.lte.${endDate})`
            )
            .order(
                "fulfillment_date",
                {
                    ascending: true,
                }
            );

    if (error) {
        throw new Error(
            error.message
        );
    }

    return data;
}

export async function getCalendarCapacityOverridesFromDatabase(
    startDate: string,
    endDate: string
) {
    const supabase =
        await createClient();

    const { data, error } =
        await supabase
            .from(
                "capacity_overrides"
            )
            .select(`
                id,
                capacity_date,
                capacity,
                is_blocked,
                notes
            `)
            .gte(
                "capacity_date",
                startDate
            )
            .lte(
                "capacity_date",
                endDate
            )
            .order(
                "capacity_date",
                {
                    ascending: true,
                }
            );

    if (error) {
        throw new Error(
            error.message
        );
    }

    return data;
}
import { createClient } from "@/lib/supabase/client";

export async function getCapacityAvailabilityFromDatabase(
  date: string,
  excludeOrderId?: string
) {
  const supabase =
    createClient();

  // 1. Get default capacity
  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from("capacity_settings")
    .select(`
      default_daily_capacity
    `)
    .eq("id", 1)
    .maybeSingle();

  if (settingsError) {
    throw new Error(
      settingsError.message
    );
  }

  const defaultCapacity =
    Number(
      settings?.default_daily_capacity ??
        5
    );

  // 2. Check date override
  const {
    data: override,
    error: overrideError,
  } = await supabase
    .from("capacity_overrides")
    .select(`
      capacity,
      is_blocked,
      notes
    `)
    .eq(
      "capacity_date",
      date
    )
    .maybeSingle();

  if (overrideError) {
    throw new Error(
      overrideError.message
    );
  }

  // 3. Count existing orders
  let orderQuery =
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
        date
      )
      .neq(
        "status",
        "cancelled"
      );

  if (excludeOrderId) {
    orderQuery =
      orderQuery.neq(
        "id",
        excludeOrderId
      );
  }

  const {
    count,
    error: ordersError,
  } = await orderQuery;

  if (ordersError) {
    throw new Error(
      ordersError.message
    );
  }

  return {
    defaultCapacity,
    override,
    bookedOrders:
      count ?? 0,
  };
}
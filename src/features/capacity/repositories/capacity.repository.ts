import { createClient } from "@/lib/supabase/server";

export async function getCapacitySettingsFromDatabase() {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("capacity_settings")
      .select(`
        default_daily_capacity
      `)
      .eq("id", 1)
      .maybeSingle();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}

export async function getCapacityOverridesFromDatabase() {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("capacity_overrides")
      .select(`
        id,
        capacity_date,
        capacity,
        is_blocked,
        notes
      `)
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
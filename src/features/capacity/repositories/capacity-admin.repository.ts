import { createClient } from "@/lib/supabase/client";

import { CapacityOverrideFormData } from "../types/capacity-form.types";

export async function updateDefaultCapacityInDatabase(
  capacity: number
) {
  const supabase =
    createClient();

  const { error } =
    await supabase
      .from("capacity_settings")
      .update({
        default_daily_capacity:
          capacity,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", 1);

  if (error) {
    throw new Error(
      error.message
    );
  }
}

export async function saveCapacityOverrideInDatabase(
  formData: CapacityOverrideFormData
) {
  const supabase =
    createClient();

  const { error } =
    await supabase
      .from("capacity_overrides")
      .upsert(
        {
          capacity_date:
            formData.capacityDate,

          capacity:
            formData.capacity,

          is_blocked:
            formData.isBlocked,

          notes:
            formData.notes.trim() ||
            null,

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "capacity_date",
        }
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}

export async function deleteCapacityOverrideFromDatabase(
  overrideId: string
) {
  const supabase =
    createClient();

  const { error } =
    await supabase
      .from("capacity_overrides")
      .delete()
      .eq(
        "id",
        overrideId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}
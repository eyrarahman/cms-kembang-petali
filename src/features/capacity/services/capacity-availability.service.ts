import { getCapacityAvailabilityFromDatabase } from "../repositories/capacity-availability.repository";

import { CapacityAvailability } from "../types/capacity-availability.types";

export async function getCapacityAvailability(
  date: string,
  excludeOrderId?: string
): Promise<CapacityAvailability> {
  if (!date) {
    throw new Error(
      "Date is required."
    );
  }

  const data =
    await getCapacityAvailabilityFromDatabase(
      date,
      excludeOrderId
    );

  const isBlocked =
    data.override?.is_blocked ??
    false;

  const capacity =
    isBlocked
      ? 0
      : Number(
          data.override
            ?.capacity ??
            data.defaultCapacity
        );

  const bookedOrders =
    data.bookedOrders;

  const availableSlots =
    Math.max(
      capacity -
        bookedOrders,
      0
    );

  return {
    date,

    capacity,

    bookedOrders,

    availableSlots,

    isBlocked,

    isFull:
      !isBlocked &&
      availableSlots <= 0,

    source:
      data.override
        ? "override"
        : "default",

    notes:
      data.override
        ?.notes ??
      undefined,
  };
}
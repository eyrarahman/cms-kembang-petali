import {
    deleteCapacityOverrideFromDatabase,
    saveCapacityOverrideInDatabase,
    updateDefaultCapacityInDatabase,
  } from "../repositories/capacity-admin.repository";
  
  import { CapacityOverrideFormData } from "../types/capacity-form.types";
  
  export async function updateDefaultCapacity(
    capacity: number
  ) {
    if (
      !Number.isInteger(
        capacity
      ) ||
      capacity < 0
    ) {
      throw new Error(
        "Default capacity must be 0 or more."
      );
    }
  
    return updateDefaultCapacityInDatabase(
      capacity
    );
  }
  
  export async function saveCapacityOverride(
    formData: CapacityOverrideFormData
  ) {
    if (
      !formData.capacityDate
    ) {
      throw new Error(
        "Please select a date."
      );
    }
  
    if (
      !Number.isInteger(
        formData.capacity
      ) ||
      formData.capacity < 0
    ) {
      throw new Error(
        "Capacity must be 0 or more."
      );
    }
  
    return saveCapacityOverrideInDatabase(
      formData
    );
  }
  
  export async function deleteCapacityOverride(
    overrideId: string
  ) {
    if (!overrideId) {
      throw new Error(
        "Capacity override ID is required."
      );
    }
  
    return deleteCapacityOverrideFromDatabase(
      overrideId
    );
  }
import {
    CapacityOverride,
    CapacitySettings,
  } from "../types/capacity.types";
  
  type CapacitySettingsDatabaseRow = {
    default_daily_capacity: number;
  };
  
  type CapacityOverrideDatabaseRow = {
    id: string;
  
    capacity_date: string;
  
    capacity: number;
  
    is_blocked: boolean;
  
    notes: string | null;
  };
  
  export function mapCapacitySettingsFromDatabase(
    settings: CapacitySettingsDatabaseRow
  ): CapacitySettings {
    return {
      defaultDailyCapacity:
        Number(
          settings.default_daily_capacity
        ),
    };
  }
  
  export function mapCapacityOverrideFromDatabase(
    override: CapacityOverrideDatabaseRow
  ): CapacityOverride {
    return {
      id: override.id,
  
      capacityDate:
        override.capacity_date,
  
      capacity:
        Number(
          override.capacity
        ),
  
      isBlocked:
        override.is_blocked,
  
      notes:
        override.notes ??
        undefined,
    };
  }
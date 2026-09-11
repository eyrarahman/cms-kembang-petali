import {
    mapCapacityOverrideFromDatabase,
    mapCapacitySettingsFromDatabase,
  } from "../mappers/capacity.mapper";
  
  import {
    getCapacityOverridesFromDatabase,
    getCapacitySettingsFromDatabase,
  } from "../repositories/capacity.repository";
  
  export async function getCapacitySettings() {
    const settings =
      await getCapacitySettingsFromDatabase();
  
    if (!settings) {
      return {
        defaultDailyCapacity: 5,
      };
    }
  
    return mapCapacitySettingsFromDatabase(
      settings
    );
  }
  
  export async function getCapacityOverrides() {
    const overrides =
      await getCapacityOverridesFromDatabase();
  
    return overrides.map(
      mapCapacityOverrideFromDatabase
    );
  }
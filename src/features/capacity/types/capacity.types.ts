export type CapacitySettings = {
    defaultDailyCapacity: number;
  };
  
  export type CapacityOverride = {
    id: string;
  
    capacityDate: string;
    capacity: number;
  
    isBlocked: boolean;
  
    notes?: string;
  };
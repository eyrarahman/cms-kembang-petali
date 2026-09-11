export type CapacityAvailability = {
    date: string;
  
    capacity: number;
    bookedOrders: number;
    availableSlots: number;
  
    isBlocked: boolean;
    isFull: boolean;
  
    source:
      | "default"
      | "override";
  
    notes?: string;
  };
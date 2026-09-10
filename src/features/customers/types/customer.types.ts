export type CustomerStatus =
  | "active"
  | "inactive";

export type Customer = {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  status: CustomerStatus;
};
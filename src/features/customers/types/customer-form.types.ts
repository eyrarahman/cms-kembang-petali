import { CustomerStatus } from "./customer.types";

export type CustomerFormData = {
  name: string;
  phone: string;
  email: string;
  status: CustomerStatus;
  notes: string;
};
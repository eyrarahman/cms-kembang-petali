import {
    Customer,
    CustomerStatus,
  } from "../types/customer.types";
  
  type CustomerDatabaseRow = {
    id: string;
    customer_code: string;
    name: string;
    phone: string;
    email: string | null;
    notes: string | null;
    status: string;
  };
  
  export function mapCustomerFromDatabase(
    customer: CustomerDatabaseRow
  ): Customer {
    return {
      id: customer.id,
  
      customerCode:
        customer.customer_code,
  
      name: customer.name,
  
      phone: customer.phone,
  
      email:
        customer.email ?? undefined,
  
      notes:
        customer.notes ?? undefined,
  
      status:
        customer.status as CustomerStatus,
    };
  }
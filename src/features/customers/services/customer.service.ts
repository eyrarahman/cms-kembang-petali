import { mapCustomerFromDatabase } from "../mappers/customer.mapper";
import {
    getCustomerByIdFromDatabase,
    getCustomersFromDatabase,
  } from "../repositories/customer.repository";

export async function getCustomers() {
  const customers =
    await getCustomersFromDatabase();

  return customers.map(
    mapCustomerFromDatabase
  );
}

export async function getCustomerById(
    customerId: string
  ) {
    const customer =
      await getCustomerByIdFromDatabase(
        customerId
      );
  
    if (!customer) {
      return null;
    }
  
    return mapCustomerFromDatabase(
      customer
    );
  }
import { mapCustomerFromDatabase } from "../mappers/customer.mapper";

import {
    createCustomerInDatabase,
    deleteCustomerFromDatabase,
    findCustomersByPhoneFromDatabase,
    updateCustomerInDatabase,
  } from "../repositories/customer-admin.repository";

import { CustomerFormData } from "../types/customer-form.types";

export async function createCustomer(
  formData: CustomerFormData
) {
  if (!formData.name.trim()) {
    throw new Error(
      "Customer name is required."
    );
  }

  if (!formData.phone.trim()) {
    throw new Error(
      "Phone number is required."
    );
  }

  return createCustomerInDatabase(
    formData
  );
}

export async function checkCustomerPhoneDuplicates(
    phone: string,
    excludeCustomerId?: string
  ) {
    if (!phone.trim()) {
      return [];
    }
  
    const customers =
      await findCustomersByPhoneFromDatabase(
        phone
      );
  
    return customers
      .map(mapCustomerFromDatabase)
      .filter(
        (customer) =>
          customer.id !==
          excludeCustomerId
      );
  }

  export async function updateCustomer(
    customerId: string,
    formData: CustomerFormData
  ) {
    if (!customerId) {
      throw new Error(
        "Customer ID is required."
      );
    }
  
    if (!formData.name.trim()) {
      throw new Error(
        "Customer name is required."
      );
    }
  
    if (!formData.phone.trim()) {
      throw new Error(
        "Phone number is required."
      );
    }
  
    return updateCustomerInDatabase(
      customerId,
      formData
    );
  }
  
  export async function deleteCustomer(
    customerId: string
  ) {
    if (!customerId) {
      throw new Error(
        "Customer ID is required."
      );
    }
  
    return deleteCustomerFromDatabase(
      customerId
    );
  }
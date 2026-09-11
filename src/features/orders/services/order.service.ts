import { mapOrderFromDatabase } from "../mappers/order.mapper";
import { mapOrderDetailFromDatabase } from "../mappers/order-detail.mapper";

import {
  getOrderByIdFromDatabase,
  getOrdersFromDatabase,
} from "../repositories/order.repository";

export async function getOrders() {
  const orders =
    await getOrdersFromDatabase();

  return orders.map(
    mapOrderFromDatabase
  );
}

export async function getOrderById(
    orderId: string
  ) {
    const order =
      await getOrderByIdFromDatabase(
        orderId
      );
  
    if (!order) {
      return null;
    }
  
    return mapOrderDetailFromDatabase(
      order
    );
  }
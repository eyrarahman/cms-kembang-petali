import {
    createOrderInDatabase,
    updateOrderInDatabase,
    updateOrderStatusInDatabase,
  } from "../repositories/order-admin.repository";
  
  import { OrderFormData } from "../types/order-form.types";
  import { calculateOrderTotals } from "../utils/order.utils";
  
  function validateOrderForm(
    formData: OrderFormData
  ) {
    if (!formData.customerId) {
      throw new Error(
        "Please select a customer."
      );
    }
  
    if (!formData.fulfillmentDate) {
      throw new Error(
        "Fulfilment date is required."
      );
    }
  
    if (
      formData.prepDays < 0 ||
      formData.prepDays > 30
    ) {
      throw new Error(
        "Prep days must be between 0 and 30."
      );
    }
  
    if (
      formData.items.length === 0
    ) {
      throw new Error(
        "Please add at least one order item."
      );
    }
  
    const invalidItem =
      formData.items.some(
        (item) =>
          !item.itemName.trim() ||
          item.quantity <= 0 ||
          item.unitPrice < 0
      );
  
    if (invalidItem) {
      throw new Error(
        "Please check all order items."
      );
    }
  
    if (
      (formData.fulfillmentType ===
        "delivery" ||
        formData.fulfillmentType ===
          "postage") &&
      !formData.fulfillmentAddress.trim()
    ) {
      throw new Error(
        "Address is required for delivery or postage."
      );
    }
  
    if (
      formData.fulfillmentFee < 0
    ) {
      throw new Error(
        "Fulfilment fee cannot be negative."
      );
    }
  
    if (
      formData.discountAmount < 0
    ) {
      throw new Error(
        "Discount cannot be negative."
      );
    }
  
    if (
      formData.amountPaid < 0
    ) {
      throw new Error(
        "Amount paid cannot be negative."
      );
    }
  
    const {
      subtotal,
      totalAmount,
    } =
      calculateOrderTotals(
        formData
      );
  
    if (
      formData.discountAmount >
      subtotal +
        formData.fulfillmentFee
    ) {
      throw new Error(
        "Discount cannot be greater than the order amount."
      );
    }
  
    if (
      formData.amountPaid >
      totalAmount
    ) {
      throw new Error(
        "Amount paid cannot be greater than the total amount."
      );
    }
  
    if (
      formData.amountPaid > 0 &&
      !formData.paymentMethod
    ) {
      throw new Error(
        "Please select a payment method."
      );
    }
  }
  
  export async function createOrder(
    formData: OrderFormData
  ) {
    validateOrderForm(formData);
  
    return createOrderInDatabase(
      formData
    );
  }
  
  export async function updateOrder(
    orderId: string,
    formData: OrderFormData
  ) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }
  
    validateOrderForm(formData);
  
    return updateOrderInDatabase(
      orderId,
      formData
    );
  }

  export async function cancelOrder(
    orderId: string
  ) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }
  
    return updateOrderStatusInDatabase(
      orderId,
      "cancelled"
    );
  }
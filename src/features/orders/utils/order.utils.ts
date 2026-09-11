import { OrderFormData } from "../types/order-form.types";
import { PaymentStatus } from "../types/order.types";

export function calculateOrderTotals(
  formData: Pick<
    OrderFormData,
    | "items"
    | "fulfillmentFee"
    | "discountAmount"
    | "amountPaid"
  >
) {
  const subtotal =
    formData.items.reduce(
      (total, item) => {
        return (
          total +
          item.quantity *
            item.unitPrice
        );
      },
      0
    );

  const beforeDiscount =
    subtotal +
    formData.fulfillmentFee;

  const totalAmount =
    Math.max(
      beforeDiscount -
        formData.discountAmount,
      0
    );

  const balanceAmount =
    Math.max(
      totalAmount -
        formData.amountPaid,
      0
    );

  let paymentStatus:
    PaymentStatus = "unpaid";

  if (formData.amountPaid <= 0) {
    paymentStatus = "unpaid";
  } else if (
    formData.amountPaid <
    totalAmount
  ) {
    paymentStatus = "partial";
  } else {
    paymentStatus = "paid";
  }

  return {
    subtotal,
    totalAmount,
    balanceAmount,
    paymentStatus,
  };
}
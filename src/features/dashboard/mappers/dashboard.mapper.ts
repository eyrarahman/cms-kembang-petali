import {
    FulfillmentType,
    OrderStatus,
} from "@/features/orders/types/order.types";

import {
    DashboardOrderItem,
    DashboardProductionItem,
} from "../types/dashboard.types";

type CustomerRelation = {
    name: string;
};

function getCustomerName(
    relation:
        | CustomerRelation
        | CustomerRelation[]
        | null
) {
    if (!relation) {
        return "Unknown Customer";
    }

    if (
        Array.isArray(relation)
    ) {
        return (
            relation[0]?.name ??
            "Unknown Customer"
        );
    }

    return relation.name;
}

type UpcomingOrderDatabaseRow = {
    id: string;

    order_code: string;

    fulfillment_date: string;

    fulfillment_type: string;

    status: string;

    total_amount: number;

    amount_paid: number;

    customers:
        | CustomerRelation
        | CustomerRelation[]
        | null;
};

export function mapUpcomingOrder(
    order: UpcomingOrderDatabaseRow
): DashboardOrderItem {
    const totalAmount =
        Number(
            order.total_amount
        );

    const amountPaid =
        Number(
            order.amount_paid
        );

    return {
        id: order.id,

        orderCode:
            order.order_code,

        customerName:
            getCustomerName(
                order.customers
            ),

        fulfillmentDate:
            order.fulfillment_date,

        fulfillmentType:
            order.fulfillment_type as FulfillmentType,

        status:
            order.status as OrderStatus,

        totalAmount,

        amountPaid,

        balanceAmount:
            Math.max(
                totalAmount -
                    amountPaid,
                0
            ),
    };
}

type ProductionOrderDatabaseRow = {
    id: string;

    order_code: string;

    fulfillment_date: string;

    fulfillment_type: string;

    status: string;

    customers:
        | CustomerRelation
        | CustomerRelation[]
        | null;
};

export function mapProductionOrder(
    order: ProductionOrderDatabaseRow
): DashboardProductionItem {
    return {
        id: order.id,

        orderCode:
            order.order_code,

        customerName:
            getCustomerName(
                order.customers
            ),

        fulfillmentDate:
            order.fulfillment_date,

        fulfillmentType:
            order.fulfillment_type as FulfillmentType,

        status:
            order.status as OrderStatus,
    };
}
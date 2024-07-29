import { Order } from "@/domain/delivery/enterprise/entities/order"

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString(),
      attachments: order.attachments,
      collectedAt: order.collectedAt,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      status: order.status,
      updatedAt: order.updatedAt,
    }
  }
}

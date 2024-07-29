import {
  Order as PrismaOrder,
  OrderStatus as PrismaOrderStatus,
  Prisma,
} from "@prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Order, OrderStatus } from "@/domain/delivery/enterprise/entities/order"

export class PrismaOrderMapper {
  static toDomin(raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityID(raw.deliverymanId)
          : null,
        status: raw.status.toLowerCase() as OrderStatus,
        collectedAt: raw.collectedAt,
        deliveredAt: raw.deliveredAt,
        returnedAt: raw.returnedAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString(),
      status: order.status.toUpperCase() as PrismaOrderStatus,
      collectedAt: order.collectedAt,
      returnedAt: order.returnedAt,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt ?? undefined,
    }
  }
}

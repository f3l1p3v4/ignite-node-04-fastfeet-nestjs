import { Injectable } from "@nestjs/common"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Order, OrderProps } from "@/domain/delivery/enterprise/entities/order"
import { PrismaOrderMapper } from "@/infra/database/prisma/mappers/prisma-order-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  return Order.create(
    {
      recipientId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}) {
    const order = makeOrder(data)

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })

    return order
  }
}

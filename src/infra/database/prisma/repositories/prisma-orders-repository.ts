import { Injectable } from "@nestjs/common"
import { Order as PrismaOrder } from "@prisma/client"

import { DomainEvents } from "@/core/events/domain-events"
import {
  FindManyNearbyParams,
  OrdersRepository,
} from "@/domain/delivery/application/repositories/orders-repository"
import { Order } from "@/domain/delivery/enterprise/entities/order"

import { PrismaOrderMapper } from "../mappers/prisma-order-mapper"
import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany()

    return orders.map(PrismaOrderMapper.toDomin)
  }

  async findManyByDeliverymanId(deliverymanId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliverymanId,
      },
    })

    return orders.map(PrismaOrderMapper.toDomin)
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
      SELECT 
        o.*
      FROM recipients r
      JOIN orders o ON o."recipientId" = r."id"
      WHERE (
        6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) 
      ) <= 10
      AND o."status" = 'WAITING'
    `

    return orders.map(PrismaOrderMapper.toDomin)
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) return null

    return PrismaOrderMapper.toDomin(order)
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: order.id.toString(),
      },
    })
  }
}

import { DomainEvents } from "@/core/events/domain-events"
import {
  FindManyNearbyParams,
  OrdersRepository,
} from "@/domain/delivery/application/repositories/orders-repository"
import { LocationService } from "@/domain/delivery/application/services/location-service"
import { Order } from "@/domain/delivery/enterprise/entities/order"

import { InMemoryRecipientsRepository } from "./in-memory-recipients-repository"

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(private recipientsRepository: InMemoryRecipientsRepository) {}

  async findAll(): Promise<Order[]> {
    return this.items
  }

  async findManyByDeliverymanId(deliverymanId: string): Promise<Order[]> {
    return this.items.filter(
      item => item.deliverymanId?.toString() === deliverymanId,
    )
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
    const recipients = this.recipientsRepository.items.filter(item => {
      const distance = LocationService.getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      )

      return distance < 10
    })

    const recipientsIds = recipients.map(item => item.id.toString())

    return this.items
      .filter(item => item.status === "waiting")
      .filter(item => recipientsIds.includes(item.recipientId.toString()))
  }

  async findById(id: string): Promise<Order | null> {
    return this.items.find(item => item.id.toString() === id) ?? null
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === order.id)

    this.items[itemIndex] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}

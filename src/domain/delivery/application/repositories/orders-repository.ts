import { Order } from "../../enterprise/entities/order"

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export abstract class OrdersRepository {
  abstract findAll(): Promise<Order[]>
  abstract findManyByDeliverymanId(deliverymanId: string): Promise<Order[]>
  abstract findManyNearby(params: FindManyNearbyParams): Promise<Order[]>
  abstract findById(id: string): Promise<Order | null>
  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}

import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"

import { Order } from "../../enterprise/entities/order"
import { OrdersRepository } from "../repositories/orders-repository"

type FetchOrdersByDeliverymanUseCaseRequest = {
  deliverymanId: string
}

type FetchOrdersByDeliverymanUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersByDeliverymanUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanId,
  }: FetchOrdersByDeliverymanUseCaseRequest): Promise<FetchOrdersByDeliverymanUseCaseResponse> {
    const orders =
      await this.ordersRepository.findManyByDeliverymanId(deliverymanId)

    return right({ orders })
  }
}

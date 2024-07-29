import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { OrdersRepository } from "../repositories/orders-repository"

type DeleteOrderUseCaseRequest = {
  orderId: string
}

type DeleteOrderUseCaseResponse = Either<ResourceNotFound, object>

@Injectable()
export class DeleteOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    await this.ordersRepository.delete(order)

    return right({})
  }
}

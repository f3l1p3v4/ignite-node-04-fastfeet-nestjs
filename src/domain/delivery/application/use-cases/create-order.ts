import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { Order } from "../../enterprise/entities/order"
import { OrdersRepository } from "../repositories/orders-repository"
import { RecipientsRepository } from "../repositories/recipients-repository"

type CreateOrderUseCaseRequest = {
  recipientId: string
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFound,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    recipientId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFound())
    }

    const order = Order.create({ recipientId: recipient.id })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}

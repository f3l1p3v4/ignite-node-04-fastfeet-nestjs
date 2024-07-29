import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowed } from "@/core/errors/not-allowed"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { Order } from "../../enterprise/entities/order"
import { OrdersRepository } from "../repositories/orders-repository"

type MarkOrderAsReturnedUseCaseRequest = {
  orderId: string
  deliverymanId: string
}

type MarkOrderAsReturnedUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsReturnedUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    deliverymanId,
  }: MarkOrderAsReturnedUseCaseRequest): Promise<MarkOrderAsReturnedUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    if (
      order.status !== "collected" ||
      !order.deliverymanId?.equals(new UniqueEntityID(deliverymanId))
    ) {
      return left(new NotAllowed())
    }

    order.status = "returned"

    await this.ordersRepository.save(order)

    return right({ order })
  }
}

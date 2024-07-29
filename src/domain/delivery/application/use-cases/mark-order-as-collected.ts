import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { NotAllowed } from "@/core/errors/not-allowed"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { Order } from "../../enterprise/entities/order"
import { DeliverymansRepository } from "../repositories/deliverymans-repository"
import { OrdersRepository } from "../repositories/orders-repository"

type MarkOrderAsCollectedUseCaseRequest = {
  orderId: string
  deliverymanId: string
}

type MarkOrderAsCollectedUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsCollectedUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverymansRepository: DeliverymansRepository,
  ) {}

  async execute({
    orderId,
    deliverymanId,
  }: MarkOrderAsCollectedUseCaseRequest): Promise<MarkOrderAsCollectedUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    if (order.status !== "waiting" && order.status !== "returned") {
      return left(new NotAllowed())
    }

    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFound())
    }

    order.deliverymanId = deliveryman.id
    order.status = "collected"

    await this.ordersRepository.save(order)

    return right({ order })
  }
}

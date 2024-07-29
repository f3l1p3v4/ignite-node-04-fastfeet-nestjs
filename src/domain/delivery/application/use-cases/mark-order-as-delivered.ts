import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowed } from "@/core/errors/not-allowed"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { Order } from "../../enterprise/entities/order"
import { OrderAttachment } from "../../enterprise/entities/order-attachment"
import { OrderAttachmentList } from "../../enterprise/entities/order-attachment-list"
import { OrdersRepository } from "../repositories/orders-repository"

type MarkOrderAsDeliveredUseCaseRequest = {
  orderId: string
  deliverymanId: string
  attachmentsIds: string[]
}

type MarkOrderAsDeliveredUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    deliverymanId,
    attachmentsIds,
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    if (
      attachmentsIds.length <= 0 ||
      order.status !== "collected" ||
      !order.deliverymanId?.equals(new UniqueEntityID(deliverymanId))
    ) {
      return left(new NotAllowed())
    }

    const orderAttachments = attachmentsIds.map(attachmentId => {
      return OrderAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        orderId: order.id,
      })
    })

    order.attachments = new OrderAttachmentList(orderAttachments)
    order.status = "delivered"

    await this.ordersRepository.save(order)

    return right({ order })
  }
}

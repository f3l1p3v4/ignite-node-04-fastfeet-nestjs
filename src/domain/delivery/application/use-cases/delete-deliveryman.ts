import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { DeliverymansRepository } from "../repositories/deliverymans-repository"

type DeleteDeliverymanUseCaseRequest = {
  deliverymanId: string
}

type DeleteDeliverymanUseCaseResponse = Either<ResourceNotFound, object>

@Injectable()
export class DeleteDeliverymanUseCase {
  constructor(private deliverymansRepository: DeliverymansRepository) {}

  async execute({
    deliverymanId,
  }: DeleteDeliverymanUseCaseRequest): Promise<DeleteDeliverymanUseCaseResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFound())
    }

    await this.deliverymansRepository.delete(deliveryman)

    return right({})
  }
}

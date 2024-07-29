import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { Deliveryman } from "../../enterprise/entities/deliveryman"
import { HashGenerator } from "../cryptography/hash-generator"
import { DeliverymansRepository } from "../repositories/deliverymans-repository"

type EditDeliverymanUseCaseRequest = {
  deliverymanId: string
  password?: string
  latitude?: number
  longitude?: number
}

type EditDeliverymanUseCaseResponse = Either<
  ResourceNotFound,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class EditDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    deliverymanId,
    password,
    latitude,
    longitude,
  }: EditDeliverymanUseCaseRequest): Promise<EditDeliverymanUseCaseResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFound())
    }

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password)

      deliveryman.password = hashedPassword
    }

    deliveryman.latitude = latitude ?? deliveryman.latitude
    deliveryman.longitude = longitude ?? deliveryman.longitude

    await this.deliverymansRepository.save(deliveryman)

    return right({ deliveryman })
  }
}

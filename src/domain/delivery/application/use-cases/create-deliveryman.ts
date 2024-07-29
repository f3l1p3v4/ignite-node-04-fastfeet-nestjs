import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { DeliverymanAlreadyExists } from "@/core/errors/deliveryman-already-exists"

import { Deliveryman } from "../../enterprise/entities/deliveryman"
import { HashGenerator } from "../cryptography/hash-generator"
import { DeliverymansRepository } from "../repositories/deliverymans-repository"

type CreateDeliverymanUseCaseRequest = {
  name: string
  email: string
  cpf: string
  password: string
  latitude: number
  longitude: number
}

type CreateDeliverymanUseCaseResponse = Either<
  DeliverymanAlreadyExists,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class CreateDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    cpf,
    password,
    latitude,
    longitude,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const deliverymanWithSameCpf =
      await this.deliverymansRepository.findByCpf(cpf)

    if (deliverymanWithSameCpf) {
      return left(new DeliverymanAlreadyExists(cpf))
    }

    const deliverymanWithSameEmail =
      await this.deliverymansRepository.findByEmail(email)

    if (deliverymanWithSameEmail) {
      return left(new DeliverymanAlreadyExists(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      name,
      email,
      cpf,
      password: hashedPassword,
      latitude,
      longitude,
    })

    await this.deliverymansRepository.create(deliveryman)

    return right({ deliveryman })
  }
}

import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { InvalidCredentials } from "@/core/errors/invalid-credentials"

import { Encrypter } from "../cryptography/encrypter"
import { HashComparer } from "../cryptography/hash-comparer"
import { DeliverymansRepository } from "../repositories/deliverymans-repository"

type AuthenticateDeliverymanUseCaseRequest = {
  cpf: string
  password: string
}

type AuthenticateDeliverymanUseCaseResponse = Either<
  InvalidCredentials,
  {
    token: string
  }
>

@Injectable()
export class AuthenticateDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliverymanUseCaseRequest): Promise<AuthenticateDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymansRepository.findByCpf(cpf)

    if (!deliveryman) {
      return left(new InvalidCredentials())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryman.password,
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentials())
    }

    const token = await this.encrypter.encrypt({
      sub: deliveryman.id.toString(),
      role: "DELIVERYMAN",
    })

    return right({ token })
  }
}

import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { InvalidCredentials } from "@/core/errors/invalid-credentials"

import { Encrypter } from "../cryptography/encrypter"
import { HashComparer } from "../cryptography/hash-comparer"
import { AdminsRepository } from "../repositories/admins-repository"

type AuthenticateAdminUseCaseRequest = {
  cpf: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  InvalidCredentials,
  {
    token: string
  }
>

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByCpf(cpf)

    if (!admin) {
      return left(new InvalidCredentials())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      admin.password,
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentials())
    }

    const token = await this.encrypter.encrypt({
      sub: admin.id.toString(),
      role: "ADMIN",
    })

    return right({ token })
  }
}

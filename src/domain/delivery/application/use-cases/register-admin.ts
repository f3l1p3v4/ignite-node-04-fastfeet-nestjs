import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { AdminAlreadyExists } from "@/core/errors/admin-already-exists"

import { Admin } from "../../enterprise/entities/admin"
import { HashGenerator } from "../cryptography/hash-generator"
import { AdminsRepository } from "../repositories/admins-repository"

type RegisterAdminUseCaseRequest = {
  name: string
  email: string
  cpf: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExists,
  {
    admin: Admin
  }
>

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    email,
    name,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminsRepository.findByCpf(cpf)

    if (adminWithSameCpf) {
      return left(new AdminAlreadyExists(cpf))
    }

    const adminWithSameEmail = await this.adminsRepository.findByEmail(email)

    if (adminWithSameEmail) {
      return left(new AdminAlreadyExists(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      cpf,
      email,
      name,
      password: hashedPassword,
    })

    await this.adminsRepository.create(admin)

    return right({ admin })
  }
}

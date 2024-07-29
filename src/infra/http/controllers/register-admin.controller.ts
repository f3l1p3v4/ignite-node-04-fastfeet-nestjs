import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from "@nestjs/common"
import { z } from "zod"

import { AdminAlreadyExists } from "@/core/errors/admin-already-exists"
import { RegisterAdminUseCase } from "@/domain/delivery/application/use-cases/register-admin"
import { Public } from "@/infra/auth/public"

import { ZodValidationPipe } from "../pipes/zod-validation.pipe"

const bodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

const bodyValidation = new ZodValidationPipe(bodySchema)

type RegisterAdminBodySchema = z.infer<typeof bodySchema>

@Controller("/register/admin")
@Public()
export class RegisterAdminController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @Post()
  async handle(@Body(bodyValidation) body: RegisterAdminBodySchema) {
    const { cpf, email, name, password } = body

    const result = await this.registerAdmin.execute({
      cpf,
      email,
      name,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AdminAlreadyExists:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

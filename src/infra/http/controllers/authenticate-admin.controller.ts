import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from "@nestjs/common"
import { z } from "zod"

import { InvalidCredentials } from "@/core/errors/invalid-credentials"
import { AuthenticateAdminUseCase } from "@/domain/delivery/application/use-cases/authenticate-admin"
import { Public } from "@/infra/auth/public"

import { ZodValidationPipe } from "../pipes/zod-validation.pipe"

const bodySchema = z.object({
  cpf: z.string(),
  password: z.string().min(6),
})

const bodyValidation = new ZodValidationPipe(bodySchema)

type AuthenticateAdminBodySchema = z.infer<typeof bodySchema>

@Controller("/sessions/admin")
@Public()
export class AuthenticateAdminController {
  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidation) body: AuthenticateAdminBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateAdmin.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentials:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { token } = result.value

    return { token }
  }
}

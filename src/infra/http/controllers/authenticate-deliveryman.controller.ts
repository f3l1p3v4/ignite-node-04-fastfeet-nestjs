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
import { AuthenticateDeliverymanUseCase } from "@/domain/delivery/application/use-cases/authenticate-deliveryman"
import { Public } from "@/infra/auth/public"

import { ZodValidationPipe } from "../pipes/zod-validation.pipe"

const bodySchema = z.object({
  cpf: z.string(),
  password: z.string().min(6),
})

const bodyValidation = new ZodValidationPipe(bodySchema)

type AuthenticateDeliverymanBodySchema = z.infer<typeof bodySchema>

@Controller("/sessions/deliveryman")
@Public()
export class AuthenticateDeliverymanController {
  constructor(
    private authenticateDeliveryman: AuthenticateDeliverymanUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidation) body: AuthenticateDeliverymanBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateDeliveryman.execute({
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

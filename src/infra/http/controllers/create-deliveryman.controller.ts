import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from "@nestjs/common"
import { z } from "zod"

import { DeliverymanAlreadyExists } from "@/core/errors/deliveryman-already-exists"
import { CreateDeliverymanUseCase } from "@/domain/delivery/application/use-cases/create-deliveryman"
import { RoleDecorator } from "@/infra/auth/role.decorator"

import { ZodValidationPipe } from "../pipes/zod-validation.pipe"

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  password: z.string().min(6),
  latitude: z.number().refine(value => Math.abs(value) <= 90),
  longitude: z.number().refine(value => Math.abs(value) <= 180),
})

const bodyValidation = new ZodValidationPipe(bodySchema)

type CreateDeliverymanBodySchema = z.infer<typeof bodySchema>

@Controller("/deliveryman")
@RoleDecorator("ADMIN")
export class CreateDeliverymanController {
  constructor(private createDeliveryman: CreateDeliverymanUseCase) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateDeliverymanBodySchema) {
    const { name, email, cpf, password, latitude, longitude } = body

    const result = await this.createDeliveryman.execute({
      name,
      email,
      cpf,
      password,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliverymanAlreadyExists:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

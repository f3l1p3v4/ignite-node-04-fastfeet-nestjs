import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from "@nestjs/common"
import { z } from "zod"

import { RecipientAlreadyExists } from "@/core/errors/recipient-already-exists"
import { CreateRecipientUseCase } from "@/domain/delivery/application/use-cases/create-recipient"
import { RoleDecorator } from "@/infra/auth/role.decorator"

import { ZodValidationPipe } from "../pipes/zod-validation.pipe"

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  latitude: z.number().refine(value => Math.abs(value) <= 90),
  longitude: z.number().refine(value => Math.abs(value) <= 180),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  district: z.string(),
  complement: z.string().optional(),
})

const bodyValidation = new ZodValidationPipe(bodySchema)

type CreateRecipientBodySchema = z.infer<typeof bodySchema>

@Controller("/recipient")
@RoleDecorator("ADMIN")
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateRecipientBodySchema) {
    const {
      name,
      email,
      latitude,
      longitude,
      address,
      city,
      district,
      state,
      zipCode,
      complement,
    } = body

    const result = await this.createRecipient.execute({
      name,
      email,
      address,
      city,
      district,
      state,
      zipCode,
      complement,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case RecipientAlreadyExists:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

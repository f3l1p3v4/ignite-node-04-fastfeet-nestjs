import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common"
import { z } from "zod"

import { EditRecipientUseCase } from "@/domain/delivery/application/use-cases/edit-recipient"
import { RoleDecorator } from "@/infra/auth/role.decorator"

import { ZodValidationPipe } from "../pipes/zod-validation.pipe"

const bodySchema = z.object({
  latitude: z
    .number()
    .refine(value => Math.abs(value) <= 90)
    .optional(),
  longitude: z
    .number()
    .refine(value => Math.abs(value) <= 180)
    .optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
})

const bodyValidation = new ZodValidationPipe(bodySchema)

type EditRecipientBodySchema = z.infer<typeof bodySchema>

@Controller("/recipient/:id")
@RoleDecorator("ADMIN")
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidation) body: EditRecipientBodySchema,
    @Param("id") id: string,
  ) {
    const {
      latitude,
      longitude,
      zipCode,
      address,
      complement,
      district,
      city,
      state,
    } = body

    const result = await this.editRecipient.execute({
      recipientId: id,
      latitude,
      longitude,
      zipCode,
      address,
      complement,
      district,
      city,
      state,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common"
import { z } from "zod"

import { EditDeliverymanUseCase } from "@/domain/delivery/application/use-cases/edit-deliveryman"
import { RoleDecorator } from "@/infra/auth/role.decorator"

import { ZodValidationPipe } from "../pipes/zod-validation.pipe"

const bodySchema = z.object({
  password: z.string().min(6).optional(),
  latitude: z
    .number()
    .refine(value => Math.abs(value) <= 90)
    .optional(),
  longitude: z
    .number()
    .refine(value => Math.abs(value) <= 180)
    .optional(),
})

const bodyValidation = new ZodValidationPipe(bodySchema)

type EditDeliverymanBodySchema = z.infer<typeof bodySchema>

@Controller("/deliveryman/:id")
@RoleDecorator("ADMIN")
export class EditDeliverymanController {
  constructor(private editDeliveryman: EditDeliverymanUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidation) body: EditDeliverymanBodySchema,
    @Param("id") id: string,
  ) {
    const { password, latitude, longitude } = body

    const result = await this.editDeliveryman.execute({
      deliverymanId: id,
      password,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

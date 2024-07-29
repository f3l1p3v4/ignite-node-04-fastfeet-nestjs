import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common"
import { z } from "zod"

import { MarkOrderAsDeliveredUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-delivered"
import { CurrentUser } from "@/infra/auth/current-user.decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { RoleDecorator } from "@/infra/auth/role.decorator"

import { ZodValidationPipe } from "../pipes/zod-validation.pipe"

const bodySchema = z.object({
  attachments: z.array(z.string().uuid()),
})

const bodyValidation = new ZodValidationPipe(bodySchema)

type MarkOrderAsDeliveredBodySchema = z.infer<typeof bodySchema>

@Controller("/order/:id/delivery")
@RoleDecorator("DELIVERYMAN")
export class MarkOrderAsDeliveredController {
  constructor(private markOrderAsDelivered: MarkOrderAsDeliveredUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidation) body: MarkOrderAsDeliveredBodySchema,
    @Param("id") id: string,
    @CurrentUser() deliveryman: UserPayload,
  ) {
    const { attachments } = body

    const result = await this.markOrderAsDelivered.execute({
      orderId: id,
      deliverymanId: deliveryman.sub,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

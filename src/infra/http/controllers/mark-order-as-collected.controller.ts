import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common"

import { MarkOrderAsCollectedUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-collected"
import { CurrentUser } from "@/infra/auth/current-user.decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { RoleDecorator } from "@/infra/auth/role.decorator"

@Controller("/order/:id/collect")
@RoleDecorator("DELIVERYMAN")
export class MarkOrderAsCollectedController {
  constructor(private markOrderAsCollected: MarkOrderAsCollectedUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param("id") id: string,
    @CurrentUser() deliveryman: UserPayload,
  ) {
    const result = await this.markOrderAsCollected.execute({
      orderId: id,
      deliverymanId: deliveryman.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

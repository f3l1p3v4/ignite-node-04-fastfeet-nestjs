import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common"

import { MarkOrderAsReturnedUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-returned"
import { CurrentUser } from "@/infra/auth/current-user.decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { RoleDecorator } from "@/infra/auth/role.decorator"

@Controller("/order/:id/return")
@RoleDecorator("DELIVERYMAN")
export class MarkOrderAsReturnedController {
  constructor(private markOrderAsReturned: MarkOrderAsReturnedUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param("id") id: string,
    @CurrentUser() deliveryman: UserPayload,
  ) {
    const result = await this.markOrderAsReturned.execute({
      orderId: id,
      deliverymanId: deliveryman.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common"

import { DeleteOrderUseCase } from "@/domain/delivery/application/use-cases/delete-order"
import { RoleDecorator } from "@/infra/auth/role.decorator"

@Controller("/order/:id")
@RoleDecorator("ADMIN")
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") id: string) {
    const result = await this.deleteOrder.execute({
      orderId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

import { BadRequestException, Controller, Param, Post } from "@nestjs/common"

import { CreateOrderUseCase } from "@/domain/delivery/application/use-cases/create-order"
import { RoleDecorator } from "@/infra/auth/role.decorator"

@Controller("/recipient/:recipientId/order")
@RoleDecorator("ADMIN")
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(@Param("recipientId") recipientId: string) {
    const result = await this.createOrder.execute({
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

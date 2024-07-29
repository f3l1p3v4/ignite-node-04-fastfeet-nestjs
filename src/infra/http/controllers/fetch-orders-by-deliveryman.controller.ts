import { Controller, Get } from "@nestjs/common"

import { FetchOrdersByDeliverymanUseCase } from "@/domain/delivery/application/use-cases/fetch-orders-by-deliveryman"
import { CurrentUser } from "@/infra/auth/current-user.decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { RoleDecorator } from "@/infra/auth/role.decorator"

import { OrderPresenter } from "../presenter/order-presenter"

@Controller("/orders/deliveryman")
@RoleDecorator("DELIVERYMAN")
export class FetchOrdersByDeliverymanController {
  constructor(
    private fetchOrdersByDeliveryman: FetchOrdersByDeliverymanUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() deliveryman: UserPayload) {
    const result = await this.fetchOrdersByDeliveryman.execute({
      deliverymanId: deliveryman.sub,
    })

    return {
      orders: result.value?.orders.map(OrderPresenter.toHTTP),
    }
  }
}

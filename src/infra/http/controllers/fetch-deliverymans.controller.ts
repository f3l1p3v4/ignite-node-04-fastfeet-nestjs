import { Controller, Get } from "@nestjs/common"

import { FetchDeliverymansUseCase } from "@/domain/delivery/application/use-cases/fetch-deliverymans"
import { RoleDecorator } from "@/infra/auth/role.decorator"

import { DeliverymanPresenter } from "../presenter/deliveryman-presenter"

@Controller("/deliveryman")
@RoleDecorator("ADMIN")
export class FetchDeliverymansController {
  constructor(private fetchDeliverymans: FetchDeliverymansUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchDeliverymans.execute()

    return {
      deliverymans: result.value?.deliverymans.map(DeliverymanPresenter.toHTTP),
    }
  }
}

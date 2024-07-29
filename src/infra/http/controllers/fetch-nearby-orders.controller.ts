import { Controller, Get, Query } from "@nestjs/common"
import { z } from "zod"

import { FetchNearbyOrdersUseCase } from "@/domain/delivery/application/use-cases/fetch-nearby-orders"
import { RoleDecorator } from "@/infra/auth/role.decorator"

import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { OrderPresenter } from "../presenter/order-presenter"

const querySchema = z.object({
  latitude: z.coerce.number().refine(value => Math.abs(value) <= 90),
  longitude: z.coerce.number().refine(value => Math.abs(value) <= 180),
})

const queryValidation = new ZodValidationPipe(querySchema)

type FetchNearbyOrdersQuerySchema = z.infer<typeof querySchema>

@Controller("/order/nearby")
@RoleDecorator("DELIVERYMAN")
export class FetchNearbyOrdersController {
  constructor(private fetchNearbyOrders: FetchNearbyOrdersUseCase) {}

  @Get()
  async handle(@Query(queryValidation) query: FetchNearbyOrdersQuerySchema) {
    const result = await this.fetchNearbyOrders.execute({
      latitude: query.latitude,
      longitude: query.longitude,
    })

    return {
      orders: result.value?.orders.map(OrderPresenter.toHTTP),
    }
  }
}

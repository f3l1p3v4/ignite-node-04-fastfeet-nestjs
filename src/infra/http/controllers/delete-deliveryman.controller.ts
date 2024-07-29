import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common"

import { DeleteDeliverymanUseCase } from "@/domain/delivery/application/use-cases/delete-deliveryman"
import { RoleDecorator } from "@/infra/auth/role.decorator"

@Controller("/deliveryman/:id")
@RoleDecorator("ADMIN")
export class DeleteDeliverymanController {
  constructor(private deleteDeliveryman: DeleteDeliverymanUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") id: string) {
    const result = await this.deleteDeliveryman.execute({
      deliverymanId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

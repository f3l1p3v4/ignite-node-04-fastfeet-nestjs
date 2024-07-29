import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common"

import { DeleteRecipientUseCase } from "@/domain/delivery/application/use-cases/delete-recipient"
import { RoleDecorator } from "@/infra/auth/role.decorator"

@Controller("/recipient/:id")
@RoleDecorator("ADMIN")
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") id: string) {
    const result = await this.deleteRecipient.execute({
      recipientId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

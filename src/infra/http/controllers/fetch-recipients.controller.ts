import { Controller, Get } from "@nestjs/common"

import { FetchRecipientsUseCase } from "@/domain/delivery/application/use-cases/fetch-recipients"
import { RoleDecorator } from "@/infra/auth/role.decorator"

import { RecipientPresenter } from "../presenter/recipient-presenter"

@Controller("/recipient")
@RoleDecorator("ADMIN")
export class FetchRecipientsController {
  constructor(private fetchRecipients: FetchRecipientsUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchRecipients.execute()

    return {
      recipients: result.value?.recipients.map(RecipientPresenter.toHTTP),
    }
  }
}

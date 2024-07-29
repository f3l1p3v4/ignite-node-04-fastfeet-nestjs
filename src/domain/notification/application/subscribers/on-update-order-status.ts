import { Injectable } from "@nestjs/common"

import { DomainEvents } from "@/core/events/domain-events"
import { EventHandler } from "@/core/events/event-handler"
import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository"
import { UpdateOrderStatusEvent } from "@/domain/delivery/enterprise/events/update-order-status-event"

import { SendNotificationUseCase } from "../use-cases/send-notification"

@Injectable()
export class OnUpdateOrderStatus implements EventHandler {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private sendNofication: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendUpdateOrderStatusNotification.bind(this),
      UpdateOrderStatusEvent.name,
    )
  }

  private async sendUpdateOrderStatusNotification({
    order,
  }: UpdateOrderStatusEvent) {
    const recipient = await this.recipientsRepository.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNofication.execute({
        recipientId: recipient.id.toString(),
        title: "Seu pedido atualizou",
        content: `O status do seu pedido mudou para ${order.status}`,
      })
    }
  }
}

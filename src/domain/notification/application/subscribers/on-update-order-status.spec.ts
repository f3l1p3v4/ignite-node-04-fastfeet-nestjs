import { makeOrder } from "test/factories/make-order"
import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { waitFor } from "test/utils/wait-for"
import { MockInstance } from "vitest"

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification"
import { OnUpdateOrderStatus } from "./on-update-order-status"

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

let sendNoficationExecSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe("OnUpdateOrderStatus", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)

    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )

    sendNoficationExecSpy = vi.spyOn(sut, "execute")

    const _ = new OnUpdateOrderStatus(inMemoryRecipientsRepository, sut)
  })

  it("should send a notification when order changing status", async () => {
    const recipient = makeRecipient()
    const order = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryRecipientsRepository.create(recipient)
    await inMemoryOrdersRepository.create(order)

    order.status = "collected"

    await inMemoryOrdersRepository.save(order)

    await waitFor(() => expect(sendNoficationExecSpy).toHaveBeenCalled())
  })
})

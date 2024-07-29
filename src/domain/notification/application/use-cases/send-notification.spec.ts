import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"

import { SendNotificationUseCase } from "./send-notification"

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe("SendNotificationUseCase", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it("should be able to create a new notification", async () => {
    const result = await sut.execute({
      recipientId: "recipient-id",
      title: "Notification title",
      content: "Notification content",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      notification: inMemoryNotificationsRepository.items[0],
    })
  })
})

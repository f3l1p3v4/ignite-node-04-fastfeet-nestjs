import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { DeleteRecipientUseCase } from "./delete-recipient"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe("DeleteRecipientUseCase", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
  })

  it("should be able to delete a recipient", async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a inexistent recipient", async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      recipientId: "recipient-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})

import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { EditRecipientUseCase } from "./edit-recipient"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditRecipientUseCase

describe("EditRecipientUseCase", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientsRepository)
  })

  it("should be able to edit a recipient", async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      latitude: 321,
      longitude: 321,
      zipCode: "00000-000",
      address: "Avenida A",
      city: "São Paulo",
      state: "SP",
      complement: "Apt 01",
      district: "Centro",
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      latitude: 321,
      longitude: 321,
      zipCode: "00000-000",
      address: "Avenida A",
      city: "São Paulo",
      state: "SP",
      complement: "Apt 01",
      district: "Centro",
    })
  })

  it("should not be able to edit a inexistent recipient", async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      recipientId: "recipient-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})

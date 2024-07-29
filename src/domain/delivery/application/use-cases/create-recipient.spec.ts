import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { RecipientAlreadyExists } from "@/core/errors/recipient-already-exists"

import { CreateRecipientUseCase } from "./create-recipient"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: CreateRecipientUseCase

describe("CreateRecipientUseCase", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository)
  })

  it("should be able to create a new recipient", async () => {
    const result = await sut.execute(makeRecipient())

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.items[0],
    })
  })

  it("should not be able to create recipient with same e-mail", async () => {
    const email = "johndoe@mail.com"

    await sut.execute(makeRecipient({ email }))
    const result = await sut.execute(makeRecipient({ email }))

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(RecipientAlreadyExists)
  })
})

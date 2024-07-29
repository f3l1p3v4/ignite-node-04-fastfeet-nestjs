import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { FetchRecipientsUseCase } from "./fetch-recipients"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: FetchRecipientsUseCase

describe("FetchRecipientsUseCase", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new FetchRecipientsUseCase(inMemoryRecipientsRepository)
  })

  it("should be able to list all recipients", async () => {
    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipients).toHaveLength(3)
    expect(result.value).toEqual({
      recipients: inMemoryRecipientsRepository.items,
    })
  })
})

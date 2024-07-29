import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { CreateOrderUseCase } from "./create-order"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe("CreateOrderUseCase", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
    )
  })

  it("should be able to create a new order", async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    })
  })

  it("should not be able to create a new order with wrong recipient ID", async () => {
    const result = await sut.execute({
      recipientId: "recipient-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})

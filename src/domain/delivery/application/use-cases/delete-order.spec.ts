import { makeOrder } from "test/factories/make-order"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { DeleteOrderUseCase } from "./delete-order"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: DeleteOrderUseCase

describe("DeleteOrderUseCase", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it("should be able to delete an order", async () => {
    const order = makeOrder()

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(0)
  })

  it("should not be able to delete an inexistent order", async () => {
    const result = await sut.execute({
      orderId: "order-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})

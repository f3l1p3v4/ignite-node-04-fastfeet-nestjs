import { makeDeliveryman } from "test/factories/make-deliveryman"
import { makeOrder } from "test/factories/make-order"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { FetchOrdersByDeliverymanUseCase } from "./fetch-orders-by-deliveryman"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersByDeliverymanUseCase

describe("FetchOrdersByDeliverymanUseCase", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchOrdersByDeliverymanUseCase(inMemoryOrdersRepository)
  })

  it("should be able to list orders by deliveryman", async () => {
    const deliveryman = makeDeliveryman()

    await inMemoryOrdersRepository.create(
      makeOrder({
        deliverymanId: deliveryman.id,
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        deliverymanId: deliveryman.id,
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        deliverymanId: deliveryman.id,
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        deliverymanId: new UniqueEntityID("deliveryman-id"),
      }),
    )

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders).toHaveLength(3)
  })
})

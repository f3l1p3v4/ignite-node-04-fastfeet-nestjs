import { makeDeliveryman } from "test/factories/make-deliveryman"
import { makeOrder } from "test/factories/make-order"
import { InMemoryDeliverymansRepository } from "test/repositories/in-memory-deliverymans-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { NotAllowed } from "@/core/errors/not-allowed"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { MarkOrderAsCollectedUseCase } from "./mark-order-as-collected"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: MarkOrderAsCollectedUseCase

describe("MarkOrderAsCollectedUseCase", () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new MarkOrderAsCollectedUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliverymansRepository,
    )
  })

  it("should be able to mark an order as collected", async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder()

    await inMemoryDeliverymansRepository.create(deliveryman)
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        collectedAt: expect.any(Date),
        status: "collected",
        deliverymanId: deliveryman.id,
      }),
    })
  })

  it("should not be able to mark an inexistent order as collected", async () => {
    const deliveryman = makeDeliveryman()

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      orderId: "order-id",
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it("should not be able to mark an order as collected with inexistent deliveryman", async () => {
    const order = makeOrder()

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: "deliveryman-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it("should not be able to mark an order as collected if status is not waiting or returned", async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder({
      status: "collected",
    })

    await inMemoryDeliverymansRepository.create(deliveryman)
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})

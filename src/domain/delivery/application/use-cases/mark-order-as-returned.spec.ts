import { makeDeliveryman } from "test/factories/make-deliveryman"
import { makeOrder } from "test/factories/make-order"
import { InMemoryDeliverymansRepository } from "test/repositories/in-memory-deliverymans-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowed } from "@/core/errors/not-allowed"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { MarkOrderAsReturnedUseCase } from "./mark-order-as-returned"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: MarkOrderAsReturnedUseCase

describe("MarkOrderAsReturnedUseCase", () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new MarkOrderAsReturnedUseCase(inMemoryOrdersRepository)
  })

  it("should be able to mark an order as returned", async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder({
      deliverymanId: deliveryman.id,
      status: "collected",
    })

    await inMemoryDeliverymansRepository.create(deliveryman)
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        returnedAt: expect.any(Date),
        status: "returned",
        deliverymanId: null,
      }),
    })
  })

  it("should not be able to mark an inexistent order as returned", async () => {
    const deliveryman = makeDeliveryman()

    const result = await sut.execute({
      orderId: "order-id",
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it("should not be able to mark an order as returned if status is not collected", async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder({
      deliverymanId: deliveryman.id,
      status: "waiting",
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

  it("should not be able to mark an order as returned with another deliveryman", async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID("deliveryman-1"))
    const order = makeOrder({
      deliverymanId: deliveryman.id,
      status: "collected",
    })

    await inMemoryOrdersRepository.create(order)
    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: "deliveryman-2",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})

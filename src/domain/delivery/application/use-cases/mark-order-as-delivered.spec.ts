import { makeDeliveryman } from "test/factories/make-deliveryman"
import { makeOrder } from "test/factories/make-order"
import { InMemoryDeliverymansRepository } from "test/repositories/in-memory-deliverymans-repository"
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowed } from "@/core/errors/not-allowed"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { MarkOrderAsDeliveredUseCase } from "./mark-order-as-delivered"

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: MarkOrderAsDeliveredUseCase

describe("MarkOrderAsDeliveredUseCase", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new MarkOrderAsDeliveredUseCase(inMemoryOrdersRepository)
  })

  it("should be able to mark an order as delivered", async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder({
      status: "collected",
      deliverymanId: deliveryman.id,
    })

    await inMemoryDeliverymansRepository.create(deliveryman)
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      attachmentsIds: ["1"],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        deliveredAt: expect.any(Date),
        status: "delivered",
        deliverymanId: deliveryman.id,
      }),
    })
  })

  it("should not be able to mark an inexistent order as delivered", async () => {
    const deliveryman = makeDeliveryman()

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      orderId: "order-id",
      deliverymanId: deliveryman.id.toString(),
      attachmentsIds: ["1"],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it("should not be able to mark an order as delivered if status is not collected", async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder({
      status: "waiting",
    })

    await inMemoryDeliverymansRepository.create(deliveryman)
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      attachmentsIds: ["1"],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowed)
  })

  it("should not be able to mark an order as delivered with another deliveryman", async () => {
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
      attachmentsIds: ["1"],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowed)
  })

  it("should not be able to mark an order as delivered without attachment", async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID("deliveryman-1"))
    const order = makeOrder({
      deliverymanId: deliveryman.id,
      status: "collected",
    })

    await inMemoryOrdersRepository.create(order)
    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})

import { makeDeliveryman } from "test/factories/make-deliveryman"
import { makeOrder } from "test/factories/make-order"
import { makeRecipient } from "test/factories/make-recipient"
import { InMemoryDeliverymansRepository } from "test/repositories/in-memory-deliverymans-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"

import { FetchNearbyOrdersUseCase } from "./fetch-nearby-orders"

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchNearbyOrdersUseCase

describe("FetchNearbyOrdersUseCase", () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchNearbyOrdersUseCase(inMemoryOrdersRepository)
  })

  it("should be able to fetch nearby orders", async () => {
    const deliveryman = makeDeliveryman({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    const recipient1 = makeRecipient({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    const recipient2 = makeRecipient({
      latitude: -27.0610928,
      longitude: -49.5229501,
    })
    const order1 = makeOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient1.id,
    })
    const order2 = makeOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient2.id,
    })

    await inMemoryDeliverymansRepository.create(deliveryman)
    await inMemoryRecipientsRepository.create(recipient1)
    await inMemoryRecipientsRepository.create(recipient2)
    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(order2)

    const result = await sut.execute({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders).toHaveLength(1)
    expect(result.value).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          recipientId: recipient1.id,
          deliverymanId: deliveryman.id,
        }),
      ]),
    })
  })
})

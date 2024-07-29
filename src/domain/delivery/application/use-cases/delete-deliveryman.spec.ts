import { makeDeliveryman } from "test/factories/make-deliveryman"
import { InMemoryDeliverymansRepository } from "test/repositories/in-memory-deliverymans-repository"

import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { DeleteDeliverymanUseCase } from "./delete-deliveryman"

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: DeleteDeliverymanUseCase

describe("DeleteDeliverymanUseCase", () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    sut = new DeleteDeliverymanUseCase(inMemoryDeliverymansRepository)
  })

  it("should be able to delete a deliveryman", async () => {
    const deliveryman = makeDeliveryman()

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymansRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a inexistent deliveryman", async () => {
    const deliveryman = makeDeliveryman()

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: "deliveryman-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})

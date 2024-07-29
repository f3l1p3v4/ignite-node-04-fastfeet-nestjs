import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeDeliveryman } from "test/factories/make-deliveryman"
import { InMemoryDeliverymansRepository } from "test/repositories/in-memory-deliverymans-repository"

import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { EditDeliverymanUseCase } from "./edit-deliveryman"

let fakeHasher: FakeHasher
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: EditDeliverymanUseCase

describe("EditDeliverymanUseCase", () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    sut = new EditDeliverymanUseCase(inMemoryDeliverymansRepository, fakeHasher)
  })

  it("should be able to edit a deliveryman", async () => {
    const deliveryman = makeDeliveryman()

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      password: "12345678",
      latitude: 321,
      longitude: 321,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0]).toMatchObject({
      latitude: 321,
      longitude: 321,
    })
  })

  it("should be able to edit a deliveryman password", async () => {
    const deliveryman = makeDeliveryman()

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      password: "12345678",
    })

    const hashedPassword = await fakeHasher.hash("12345678")

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it("should not be able to edit a inexistent deliveryman", async () => {
    const deliveryman = makeDeliveryman()

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: "deliveryman-id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})

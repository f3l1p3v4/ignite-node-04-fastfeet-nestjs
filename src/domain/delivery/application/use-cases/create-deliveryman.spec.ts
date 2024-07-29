import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeDeliveryman } from "test/factories/make-deliveryman"
import { InMemoryDeliverymansRepository } from "test/repositories/in-memory-deliverymans-repository"

import { DeliverymanAlreadyExists } from "@/core/errors/deliveryman-already-exists"

import { CreateDeliverymanUseCase } from "./create-deliveryman"

let fakeHasher: FakeHasher
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: CreateDeliverymanUseCase

describe("CreateDeliverymanUseCase", () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    sut = new CreateDeliverymanUseCase(
      inMemoryDeliverymansRepository,
      fakeHasher,
    )
  })

  it("should be able to create a new deliveryman", async () => {
    const result = await sut.execute(makeDeliveryman())

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliverymansRepository.items[0],
    })
  })

  it("should hash deliveryman password upon registration", async () => {
    const result = await sut.execute(
      makeDeliveryman({
        password: "123456",
      }),
    )

    const hashedPassword = await fakeHasher.hash("123456")

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it("should not be able to create deliveryman with same cpf", async () => {
    const cpf = "12345678911"

    await sut.execute(makeDeliveryman({ cpf }))
    const result = await sut.execute(makeDeliveryman({ cpf }))

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliverymanAlreadyExists)
  })

  it("should not be able to create deliveryman with same e-mail", async () => {
    const cpf = "11111111111"
    const email = "johndoe@mail.com"

    await sut.execute(makeDeliveryman({ email, cpf }))
    const result = await sut.execute(makeDeliveryman({ email }))

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliverymanAlreadyExists)
  })
})

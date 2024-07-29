import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeDeliveryman } from "test/factories/make-deliveryman"
import { InMemoryDeliverymansRepository } from "test/repositories/in-memory-deliverymans-repository"

import { InvalidCredentials } from "@/core/errors/invalid-credentials"

import { AuthenticateDeliverymanUseCase } from "./authenticate-deliveryman"

let fakeHasher: FakeHasher
let encrypter: FakeEncrypter
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: AuthenticateDeliverymanUseCase

describe("AuthenticateDeliverymanUseCase", () => {
  beforeEach(() => {
    encrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    sut = new AuthenticateDeliverymanUseCase(
      inMemoryDeliverymansRepository,
      fakeHasher,
      encrypter,
    )
  })

  it("should be able to authenticate a deliveryman", async () => {
    const deliveryman = makeDeliveryman({
      cpf: "12345678910",
      password: await fakeHasher.hash("123456"),
    })

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      cpf: "12345678910",
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      token: expect.any(String),
    })
  })

  it("should not be able to authenticate deliveryman with wrong cpf", async () => {
    const cpf = "12345678911"

    await inMemoryDeliverymansRepository.create(makeDeliveryman({ cpf }))

    const result = await sut.execute({ cpf: "123", password: "123456" })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it("should not be able to authenticate deliveryman with wrong password", async () => {
    const cpf = "11111111111"

    await inMemoryDeliverymansRepository.create(makeDeliveryman({ cpf }))

    const result = await sut.execute({
      cpf,
      password: "123",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })
})

import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeAdmin } from "test/factories/make-admin"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"

import { InvalidCredentials } from "@/core/errors/invalid-credentials"

import { AuthenticateAdminUseCase } from "./authenticate-admin"

let fakeHasher: FakeHasher
let encrypter: FakeEncrypter
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: AuthenticateAdminUseCase

describe("AuthenticateAdminUseCase", () => {
  beforeEach(() => {
    encrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeHasher,
      encrypter,
    )
  })

  it("should be able to authenticate an admin", async () => {
    const admin = makeAdmin({
      cpf: "12345678910",
      password: await fakeHasher.hash("123456"),
    })

    await inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      cpf: "12345678910",
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      token: expect.any(String),
    })
  })

  it("should not be able to authenticate admin with wrong cpf", async () => {
    const cpf = "12345678911"

    await inMemoryAdminsRepository.create(makeAdmin({ cpf }))

    const result = await sut.execute({ cpf: "123", password: "123456" })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it("should not be able to authenticate admin with wrong password", async () => {
    const cpf = "11111111111"

    await inMemoryAdminsRepository.create(makeAdmin({ cpf }))

    const result = await sut.execute({
      cpf,
      password: "123",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })
})

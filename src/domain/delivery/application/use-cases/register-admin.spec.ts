import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeAdmin } from "test/factories/make-admin"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"

import { AdminAlreadyExists } from "@/core/errors/admin-already-exists"

import { RegisterAdminUseCase } from "./register-admin"

let fakeHasher: FakeHasher
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: RegisterAdminUseCase

describe("RegisterAdminUseCase", () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new RegisterAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it("should be able to register a new admin", async () => {
    const result = await sut.execute(makeAdmin())

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: inMemoryAdminsRepository.items[0],
    })
  })

  it("should hash admin password upon registration", async () => {
    const result = await sut.execute(
      makeAdmin({
        password: "123456",
      }),
    )

    const hashedPassword = await fakeHasher.hash("123456")

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0].password).toEqual(hashedPassword)
  })

  it("should not be able to register admin with same cpf", async () => {
    const cpf = "12345678911"

    await sut.execute(makeAdmin({ cpf }))
    const result = await sut.execute(makeAdmin({ cpf }))

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AdminAlreadyExists)
  })

  it("should not be able to register admin with same e-mail", async () => {
    const cpf = "11111111111"
    const email = "johndoe@mail.com"

    await sut.execute(makeAdmin({ email, cpf }))
    const result = await sut.execute(makeAdmin({ email }))

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AdminAlreadyExists)
  })
})

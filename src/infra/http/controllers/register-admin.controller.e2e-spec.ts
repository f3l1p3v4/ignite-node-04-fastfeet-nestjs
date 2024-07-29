import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

let app: INestApplication
let prisma: PrismaService

describe("Register Admin (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test("[POST] /register/admin", async () => {
    const response = await request(app.getHttpServer())
      .post("/register/admin")
      .send({
        name: "John Doe",
        email: "johndoe@email.com",
        password: "123456",
        cpf: "12345678900",
      })

    expect(response.statusCode).toEqual(201)

    const adminOnDb = await prisma.user.findUnique({
      where: {
        email: "johndoe@email.com",
      },
    })

    expect(adminOnDb).toBeTruthy()
  })
})

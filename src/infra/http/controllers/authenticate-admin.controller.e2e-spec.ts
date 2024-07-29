import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { hash } from "bcryptjs"
import request from "supertest"
import { AdminFactory } from "test/factories/make-admin"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

let app: INestApplication
let prisma: PrismaService
let adminFactory: AdminFactory

describe("Authenticate Admin (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test("[POST] /authenticate/admin", async () => {
    await adminFactory.makePrismaAdmin({
      password: await hash("123456", 8),
      cpf: "12345678900",
    })

    const response = await request(app.getHttpServer())
      .post("/sessions/admin")
      .send({
        password: "123456",
        cpf: "12345678900",
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})

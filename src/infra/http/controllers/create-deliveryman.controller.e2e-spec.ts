import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { AdminFactory } from "test/factories/make-admin"
import { DeliverymanFactory } from "test/factories/make-deliveryman"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let adminFactory: AdminFactory
let deliverymanFactory: DeliverymanFactory

describe("Create Deliveryman (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test("[POST] /deliveryman", async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const token = jwt.sign({ sub: admin.id.toString(), role: "ADMIN" })

    const response = await request(app.getHttpServer())
      .post("/deliveryman")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John",
        email: "john@email.com",
        password: "123456",
        cpf: "12345678900",
        latitude: 0,
        longitude: 0,
      })

    expect(response.statusCode).toEqual(201)
  })
})

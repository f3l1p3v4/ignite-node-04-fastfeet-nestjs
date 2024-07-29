import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { AdminFactory } from "test/factories/make-admin"
import { OrderFactory } from "test/factories/make-order"
import { RecipientFactory } from "test/factories/make-recipient"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let adminFactory: AdminFactory
let recipientFactory: RecipientFactory
let orderFactory: OrderFactory

describe("Create Order (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test("[POST] /recipient/:recipientId/order", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()

    const token = jwt.sign({ sub: admin.id.toString(), role: "ADMIN" })

    const response = await request(app.getHttpServer())
      .post(`/recipient/${recipient.id.toString()}/order`)
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(201)
  })
})

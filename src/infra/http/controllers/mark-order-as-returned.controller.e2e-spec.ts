import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { DeliverymanFactory } from "test/factories/make-deliveryman"
import { OrderFactory } from "test/factories/make-order"
import { RecipientFactory } from "test/factories/make-recipient"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let deliverymanFactory: DeliverymanFactory
let recipientFactory: RecipientFactory
let orderFactory: OrderFactory

describe("Mark Order as Returned (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, OrderFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test("[PATCH] /order/:id/return", async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
      status: "collected",
    })

    const token = jwt.sign({
      sub: deliveryman.id.toString(),
      role: "DELIVERYMAN",
    })

    const response = await request(app.getHttpServer())
      .patch(`/order/${order.id.toString()}/return`)
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const orderOnDb = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })

    expect(orderOnDb?.returnedAt).toEqual(expect.any(Date))
  })
})

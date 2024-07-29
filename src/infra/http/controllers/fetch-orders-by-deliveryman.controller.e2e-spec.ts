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
let orderFactory: OrderFactory
let recipientFactory: RecipientFactory
let deliverymanFactory: DeliverymanFactory

describe("Fetch Orders by Deliveryman (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, DeliverymanFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test("[GET] /orders/deliveryman", async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()

    const token = jwt.sign({
      sub: deliveryman.id.toString(),
      role: "DELIVERYMAN",
    })

    await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
    })
    await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
    })
    await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/orders/deliveryman`)
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.orders).toHaveLength(3)
  })
})

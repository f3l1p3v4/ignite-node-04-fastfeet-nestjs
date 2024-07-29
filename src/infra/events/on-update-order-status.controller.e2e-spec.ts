import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { DeliverymanFactory } from "test/factories/make-deliveryman"
import { OrderFactory } from "test/factories/make-order"
import { RecipientFactory } from "test/factories/make-recipient"
import { waitFor } from "test/utils/wait-for"

import { DomainEvents } from "@/core/events/domain-events"

import { AppModule } from "../app.module"
import { DatabaseModule } from "../database/database.module"
import { PrismaService } from "../database/prisma/prisma.service"

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let deliverymanFactory: DeliverymanFactory
let recipientFactory: RecipientFactory
let orderFactory: OrderFactory

describe("On Update Order Status (E2E)", () => {
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

    DomainEvents.shouldRun = true

    await app.init()
  })

  it("should send a notification when order status has changed", async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    const token = jwt.sign({
      sub: deliveryman.id.toString(),
      role: "DELIVERYMAN",
    })

    await request(app.getHttpServer())
      .patch(`/order/${order.id.toString()}/collect`)
      .set("Authorization", `Bearer ${token}`)
      .send()

    await waitFor(async () => {
      const notificationOnDb = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDb).toBeTruthy()
    })
  })
})

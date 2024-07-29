import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { AdminFactory } from "test/factories/make-admin"
import { DeliverymanFactory } from "test/factories/make-deliveryman"
import { OrderFactory } from "test/factories/make-order"
import { RecipientFactory } from "test/factories/make-recipient"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let adminFactory: AdminFactory
let deliverymanFactory: DeliverymanFactory
let recipientFactory: RecipientFactory
let orderFactory: OrderFactory

describe("Fetch Nearby Orders (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        RecipientFactory,
        DeliverymanFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test("[GET] /order/nearby", async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    const recipient = await recipientFactory.makePrismaRecipient({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    const recipient2 = await recipientFactory.makePrismaRecipient({
      latitude: -27.0610928,
      longitude: -49.5229501,
    })

    const token = jwt.sign({
      sub: deliveryman.id.toString(),
      role: "DELIVERYMAN",
    })

    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })
    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })
    await orderFactory.makePrismaOrder({
      recipientId: recipient2.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/order/nearby`)
      .set("Authorization", `Bearer ${token}`)
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.orders).toHaveLength(2)
  })
})

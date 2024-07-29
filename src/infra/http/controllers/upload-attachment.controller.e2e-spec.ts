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

describe("Upload Attachment (E2E)", () => {
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

  test("[POST] /attachments", async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const token = jwt.sign({
      sub: deliveryman.id.toString(),
      role: "DELIVERYMAN",
    })

    const response = await request(app.getHttpServer())
      .post("/attachments")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", "./test/e2e/sample-upload.png")

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
  })
})

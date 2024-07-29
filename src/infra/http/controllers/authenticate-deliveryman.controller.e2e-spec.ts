import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { hash } from "bcryptjs"
import request from "supertest"
import { DeliverymanFactory } from "test/factories/make-deliveryman"

import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

let app: INestApplication
let prisma: PrismaService
let deliverymanFactory: DeliverymanFactory

describe("Authenticate Deliveryman (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test("[POST] /authenticate/deliveryman", async () => {
    await deliverymanFactory.makePrismaDeliveryman({
      password: await hash("123456", 8),
      cpf: "12345678900",
    })

    const response = await request(app.getHttpServer())
      .post("/sessions/deliveryman")
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

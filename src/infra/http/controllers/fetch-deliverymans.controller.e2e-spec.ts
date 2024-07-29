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

describe("Fetch Deliveryman (E2E)", () => {
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

  test("[GET] /deliveryman", async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const token = jwt.sign({ sub: admin.id.toString(), role: "ADMIN" })

    await deliverymanFactory.makePrismaDeliveryman()
    await deliverymanFactory.makePrismaDeliveryman({ cpf: "32132132121" })
    await deliverymanFactory.makePrismaDeliveryman({ cpf: "12312312312" })

    const response = await request(app.getHttpServer())
      .get(`/deliveryman`)
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.deliverymans).toHaveLength(3)
  })
})

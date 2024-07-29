import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  Deliveryman,
  DeliverymanProps,
} from "@/domain/delivery/enterprise/entities/deliveryman"
import { PrismaDeliverymanMapper } from "@/infra/database/prisma/mappers/prisma-deliveryman-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
) {
  return Deliveryman.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      cpf: "12345678900",
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class DeliverymanFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryman(data: Partial<DeliverymanProps> = {}) {
    const deliveryman = makeDeliveryman(data)

    await this.prisma.user.create({
      data: PrismaDeliverymanMapper.toPrisma(deliveryman),
    })

    return deliveryman
  }
}

import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  Recipient,
  RecipientProps,
} from "@/domain/delivery/enterprise/entities/recipient"
import { PrismaRecipientMapper } from "@/infra/database/prisma/mappers/prisma-recipient-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  return Recipient.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      zipCode: faker.location.zipCode(),
      address: faker.location.streetAddress(),
      district: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(data: Partial<RecipientProps> = {}) {
    const recipient = makeRecipient(data)

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    })

    return recipient
  }
}

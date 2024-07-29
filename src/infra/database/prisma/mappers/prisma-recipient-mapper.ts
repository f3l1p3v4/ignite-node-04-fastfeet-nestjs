import { Prisma, Recipient as PrismaRecipient } from "@prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Recipient } from "@/domain/delivery/enterprise/entities/recipient"

export class PrismaRecipientMapper {
  static toDomin(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
        address: raw.address,
        city: raw.city,
        state: raw.state,
        complement: raw.complement,
        district: raw.district,
        zipCode: raw.zipCode,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
      address: recipient.address,
      city: recipient.city,
      state: recipient.state,
      complement: recipient.complement,
      district: recipient.district,
      zipCode: recipient.zipCode,
    }
  }
}

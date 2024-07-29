import { Prisma, User as PrismaDeliveryman } from "@prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Deliveryman } from "@/domain/delivery/enterprise/entities/deliveryman"

export class PrismaDeliverymanMapper {
  static toDomin(raw: PrismaDeliveryman): Deliveryman {
    return Deliveryman.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        cpf: raw.cpf,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(deliveryman: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      email: deliveryman.email,
      password: deliveryman.password,
      cpf: deliveryman.cpf,
      role: "DELIVERYMAN",
      latitude: deliveryman.latitude,
      longitude: deliveryman.longitude,
    }
  }
}

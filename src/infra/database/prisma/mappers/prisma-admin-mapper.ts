import { Prisma, User as PrismaAdmin } from "@prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Admin } from "@/domain/delivery/enterprise/entities/admin"

export class PrismaAdminMapper {
  static toDomin(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        cpf: raw.cpf,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
      cpf: admin.cpf,
      role: "ADMIN",
      latitude: 0,
      longitude: 0,
    }
  }
}

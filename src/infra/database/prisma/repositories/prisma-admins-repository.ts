import { Injectable } from "@nestjs/common"

import { AdminsRepository } from "@/domain/delivery/application/repositories/admins-repository"
import { Admin } from "@/domain/delivery/enterprise/entities/admin"

import { PrismaAdminMapper } from "../mappers/prisma-admin-mapper"
import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf,
        role: "ADMIN",
      },
    })

    if (!admin) return null

    return PrismaAdminMapper.toDomin(admin)
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        email,
        role: "ADMIN",
      },
    })

    if (!admin) return null

    return PrismaAdminMapper.toDomin(admin)
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({
      data,
    })
  }
}

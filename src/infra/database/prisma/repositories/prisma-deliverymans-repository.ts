import { Injectable } from "@nestjs/common"

import { DeliverymansRepository } from "@/domain/delivery/application/repositories/deliverymans-repository"
import { Deliveryman } from "@/domain/delivery/enterprise/entities/deliveryman"

import { PrismaDeliverymanMapper } from "../mappers/prisma-deliveryman-mapper"
import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaDeliverymansRepository implements DeliverymansRepository {
  public items: Deliveryman[] = []

  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Deliveryman[]> {
    const deliverymans = await this.prisma.user.findMany({
      where: {
        role: "DELIVERYMAN",
      },
    })

    return deliverymans.map(PrismaDeliverymanMapper.toDomin)
  }

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        id,
        role: "DELIVERYMAN",
      },
    })

    if (!deliveryman) return null

    return PrismaDeliverymanMapper.toDomin(deliveryman)
  }

  async findByCpf(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        cpf,
        role: "DELIVERYMAN",
      },
    })

    if (!deliveryman) return null

    return PrismaDeliverymanMapper.toDomin(deliveryman)
  }

  async findByEmail(email: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        email,
        role: "DELIVERYMAN",
      },
    })

    if (!deliveryman) return null

    return PrismaDeliverymanMapper.toDomin(deliveryman)
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.create({
      data,
    })
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: deliveryman.id.toString(),
      },
    })
  }
}

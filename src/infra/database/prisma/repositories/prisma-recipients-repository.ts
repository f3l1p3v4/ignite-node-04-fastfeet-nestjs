import { Injectable } from "@nestjs/common"

import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository"
import { Recipient } from "@/domain/delivery/enterprise/entities/recipient"

import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper"
import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany()

    return recipients.map(PrismaRecipientMapper.toDomin)
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) return null

    return PrismaRecipientMapper.toDomin(recipient)
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        email,
      },
    })

    if (!recipient) return null

    return PrismaRecipientMapper.toDomin(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async delete(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id: recipient.id.toString(),
      },
    })
  }
}

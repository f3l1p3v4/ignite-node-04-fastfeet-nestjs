import { Injectable } from "@nestjs/common"

import { OrderAttachmentsRepository } from "@/domain/delivery/application/repositories/order-attachments-repository"
import { OrderAttachment } from "@/domain/delivery/enterprise/entities/order-attachment"

import { PrismaOrderAttachmentMapper } from "../mappers/prisma-order-attachment-mapper"
import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaOrderAttachmentsRepository
  implements OrderAttachmentsRepository
{
  public items: OrderAttachment[] = []

  constructor(private prisma: PrismaService) {}

  async createMany(attachments: OrderAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const data = PrismaOrderAttachmentMapper.toPrisma(attachments)

    await this.prisma.attachment.updateMany(data)
  }
}

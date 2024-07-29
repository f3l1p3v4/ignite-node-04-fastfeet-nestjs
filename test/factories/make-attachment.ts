import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  Attachment,
  AttachmentProps,
} from "@/domain/delivery/enterprise/entities/attachment"
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-attachment-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  return Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.internet.url(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(data: Partial<AttachmentProps> = {}) {
    const attachment = makeAttachment(data)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }
}

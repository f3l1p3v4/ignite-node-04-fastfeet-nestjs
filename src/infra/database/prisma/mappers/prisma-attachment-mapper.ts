import { Attachment as PrismaAttachment, Prisma } from "@prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Attachment } from "@/domain/delivery/enterprise/entities/attachment"

export class PrismaAttachmentMapper {
  static toDomin(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}

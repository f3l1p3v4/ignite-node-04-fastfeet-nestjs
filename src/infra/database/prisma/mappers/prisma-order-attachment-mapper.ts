import { Attachment as PrismaAttachment, Prisma } from "@prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { OrderAttachment } from "@/domain/delivery/enterprise/entities/order-attachment"

export class PrismaOrderAttachmentMapper {
  static toDomin(raw: PrismaAttachment): OrderAttachment {
    if (!raw.orderId) {
      throw new Error("Invalid attachment type.")
    }

    return OrderAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        orderId: new UniqueEntityID(raw.orderId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    attachments: OrderAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map(attachment =>
      attachment.attachmentId.toString(),
    )

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        orderId: attachments[0].orderId.toString(),
      },
    }
  }
}

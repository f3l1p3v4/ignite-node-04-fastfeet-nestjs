import { OrderAttachment } from "../../enterprise/entities/order-attachment"

export abstract class OrderAttachmentsRepository {
  abstract createMany(attachments: OrderAttachment[]): Promise<void>
}

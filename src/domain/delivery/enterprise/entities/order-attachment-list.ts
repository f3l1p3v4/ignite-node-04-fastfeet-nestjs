import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { WatchedList } from "@/core/entities/watched-list"

import { OrderAttachment } from "./order-attachment"

export interface OrderAttachmentProps {
  attachmentId: UniqueEntityID
  orderId: UniqueEntityID
}

export class OrderAttachmentList extends WatchedList<OrderAttachment> {
  compareItems(a: OrderAttachment, b: OrderAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}

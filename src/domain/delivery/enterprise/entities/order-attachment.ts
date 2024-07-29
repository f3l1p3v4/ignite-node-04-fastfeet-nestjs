import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface OrderAttachmentProps {
  attachmentId: UniqueEntityID
  orderId: UniqueEntityID
}

export class OrderAttachment extends Entity<OrderAttachmentProps> {
  get attachmentId() {
    return this.props.attachmentId
  }

  get orderId() {
    return this.props.orderId
  }

  static create(props: OrderAttachmentProps, id?: UniqueEntityID) {
    return new OrderAttachment(props, id)
  }
}

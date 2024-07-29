import { AggregateRoot } from "@/core/entities/aggregate-root"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

import { UpdateOrderStatusEvent } from "../events/update-order-status-event"
import { OrderAttachmentList } from "./order-attachment-list"

export type OrderStatus = "waiting" | "collected" | "delivered" | "returned"

export interface OrderProps {
  deliverymanId?: UniqueEntityID | null
  recipientId: UniqueEntityID
  status: OrderStatus
  collectedAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null
  attachments: OrderAttachmentList
}

export class Order extends AggregateRoot<OrderProps> {
  get deliverymanId() {
    return this.props.deliverymanId
  }

  get recipientId() {
    return this.props.recipientId
  }

  get status() {
    return this.props.status
  }

  get collectedAt() {
    return this.props.collectedAt
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get attachments() {
    return this.props.attachments
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set deliverymanId(deliverymanId) {
    this.props.deliverymanId = deliverymanId
    this.touch()
  }

  set status(status) {
    this.props.status = status

    this.addDomainEvent(new UpdateOrderStatusEvent(this))

    switch (status) {
      case "collected":
        this.props.collectedAt = new Date()
        this.touch()
        break
      case "delivered":
        this.props.deliveredAt = new Date()
        this.touch()
        break
      case "returned":
        this.props.returnedAt = new Date()
        this.props.deliverymanId = null
        this.touch()
        break
    }
  }

  set attachments(attachments) {
    this.props.attachments = attachments
    this.touch()
  }

  static create(
    props: Optional<OrderProps, "createdAt" | "status" | "attachments">,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? "waiting",
        attachments: new OrderAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}

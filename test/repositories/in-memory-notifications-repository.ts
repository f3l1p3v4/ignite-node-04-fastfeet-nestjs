import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository"
import { Notification } from "@/domain/notification/enterprise/entities/notification"

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async findAll(): Promise<Notification[]> {
    return this.items
  }

  async findById(id: string): Promise<Notification | null> {
    return this.items.find(item => item.id.toString() === id) ?? null
  }

  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === notification.id)

    this.items[itemIndex] = notification
  }

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }
}

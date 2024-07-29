import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository"
import { Recipient } from "@/domain/delivery/enterprise/entities/recipient"

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findAll(): Promise<Recipient[]> {
    return this.items
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    return this.items.find(item => item.email === email) ?? null
  }

  async findById(id: string): Promise<Recipient | null> {
    return this.items.find(item => item.id.toString() === id) ?? null
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async delete(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === recipient.id)

    this.items.splice(itemIndex, 1)
  }
}

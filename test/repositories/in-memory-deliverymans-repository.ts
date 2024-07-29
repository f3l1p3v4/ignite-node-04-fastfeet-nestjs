import { DeliverymansRepository } from "@/domain/delivery/application/repositories/deliverymans-repository"
import { Deliveryman } from "@/domain/delivery/enterprise/entities/deliveryman"

export class InMemoryDeliverymansRepository implements DeliverymansRepository {
  public items: Deliveryman[] = []

  async findAll(): Promise<Deliveryman[]> {
    return this.items
  }

  async findByCpf(cpf: string): Promise<Deliveryman | null> {
    return this.items.find(item => item.cpf === cpf) ?? null
  }

  async findByEmail(email: string): Promise<Deliveryman | null> {
    return this.items.find(item => item.email === email) ?? null
  }

  async findById(id: string): Promise<Deliveryman | null> {
    return this.items.find(item => item.id.toString() === id) ?? null
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === deliveryman.id)

    this.items[itemIndex] = deliveryman
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    this.items.push(deliveryman)
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === deliveryman.id)

    this.items.splice(itemIndex, 1)
  }
}

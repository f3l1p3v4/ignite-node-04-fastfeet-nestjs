import { AdminsRepository } from "@/domain/delivery/application/repositories/admins-repository"
import { Admin } from "@/domain/delivery/enterprise/entities/admin"

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findByCpf(cpf: string): Promise<Admin | null> {
    return this.items.find(item => item.cpf === cpf) ?? null
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.items.find(item => item.email === email) ?? null
  }

  async save(admin: Admin): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === admin.id)

    this.items[itemIndex] = admin
  }

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }
}

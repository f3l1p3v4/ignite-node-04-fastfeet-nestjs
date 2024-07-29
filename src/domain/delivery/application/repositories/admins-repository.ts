import { Admin } from "../../enterprise/entities/admin"

export abstract class AdminsRepository {
  abstract findByCpf(cpf: string): Promise<Admin | null>
  abstract findByEmail(email: string): Promise<Admin | null>
  abstract save(admin: Admin): Promise<void>
  abstract create(admin: Admin): Promise<void>
}

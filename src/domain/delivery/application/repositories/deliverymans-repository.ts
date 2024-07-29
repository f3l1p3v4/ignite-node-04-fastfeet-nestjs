import { Deliveryman } from "../../enterprise/entities/deliveryman"

export abstract class DeliverymansRepository {
  abstract findAll(): Promise<Deliveryman[]>
  abstract findById(id: string): Promise<Deliveryman | null>
  abstract findByCpf(cpf: string): Promise<Deliveryman | null>
  abstract findByEmail(email: string): Promise<Deliveryman | null>
  abstract save(deliveryman: Deliveryman): Promise<void>
  abstract create(deliveryman: Deliveryman): Promise<void>
  abstract delete(deliveryman: Deliveryman): Promise<void>
}

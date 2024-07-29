import { Recipient } from "../../enterprise/entities/recipient"

export abstract class RecipientsRepository {
  abstract findAll(): Promise<Recipient[]>
  abstract findById(id: string): Promise<Recipient | null>
  abstract findByEmail(email: string): Promise<Recipient | null>
  abstract save(recipient: Recipient): Promise<void>
  abstract create(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}

import { Recipient } from "@/domain/delivery/enterprise/entities/recipient"

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
      address: recipient.address,
      city: recipient.city,
      state: recipient.state,
      district: recipient.district,
      zipCode: recipient.zipCode,
      complement: recipient.complement,
    }
  }
}

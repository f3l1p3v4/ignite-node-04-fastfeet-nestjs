import { Deliveryman } from "@/domain/delivery/enterprise/entities/deliveryman"

export class DeliverymanPresenter {
  static toHTTP(deliveryman: Deliveryman) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      email: deliveryman.email,
      cpf: deliveryman.cpf,
      latitude: deliveryman.latitude,
      longitude: deliveryman.longitude,
    }
  }
}

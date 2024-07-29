import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface DeliverymanProps {
  name: string
  email: string
  cpf: string
  password: string
  latitude: number
  longitude: number
}

export class Deliveryman extends Entity<DeliverymanProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  set password(password: string) {
    this.props.password = password
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
  }

  static create(props: DeliverymanProps, id?: UniqueEntityID) {
    const deliveryman = new Deliveryman(props, id)

    return deliveryman
  }
}

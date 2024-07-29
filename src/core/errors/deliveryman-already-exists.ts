import { UseCaseError } from "./use-case-error"

export class DeliverymanAlreadyExists extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Deliveryman "${identifier}" already exists.`)
  }
}

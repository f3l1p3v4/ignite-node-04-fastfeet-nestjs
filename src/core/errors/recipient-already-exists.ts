import { UseCaseError } from "./use-case-error"

export class RecipientAlreadyExists extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Recipient "${identifier}" already exists.`)
  }
}

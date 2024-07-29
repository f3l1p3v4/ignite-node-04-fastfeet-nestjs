import { UseCaseError } from "./use-case-error"

export class AdminAlreadyExists extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Admin "${identifier}" already exists.`)
  }
}

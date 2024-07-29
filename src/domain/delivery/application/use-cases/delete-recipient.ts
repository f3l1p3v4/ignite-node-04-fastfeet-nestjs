import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { RecipientsRepository } from "../repositories/recipients-repository"

type DeleteRecipientUseCaseRequest = {
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<ResourceNotFound, object>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFound())
    }

    await this.recipientsRepository.delete(recipient)

    return right({})
  }
}

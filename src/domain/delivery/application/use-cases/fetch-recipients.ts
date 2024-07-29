import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"

import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientsRepository } from "../repositories/recipients-repository"

type FetchRecipientsUseCaseResponse = Either<
  null,
  {
    recipients: Recipient[]
  }
>

@Injectable()
export class FetchRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute(): Promise<FetchRecipientsUseCaseResponse> {
    const recipients = await this.recipientsRepository.findAll()

    return right({ recipients })
  }
}

import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { RecipientAlreadyExists } from "@/core/errors/recipient-already-exists"

import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientsRepository } from "../repositories/recipients-repository"

type CreateRecipientUseCaseRequest = {
  name: string
  email: string
  latitude: number
  longitude: number
  zipCode: string
  address: string
  complement?: string | null
  district: string
  city: string
  state: string
}

type CreateRecipientUseCaseResponse = Either<
  RecipientAlreadyExists,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    name,
    email,
    latitude,
    longitude,
    zipCode,
    address,
    complement,
    district,
    city,
    state,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipientWithSameEmail =
      await this.recipientsRepository.findByEmail(email)

    if (recipientWithSameEmail) {
      return left(new RecipientAlreadyExists(email))
    }

    const recipient = Recipient.create({
      name,
      email,
      latitude,
      longitude,
      zipCode,
      address,
      complement,
      district,
      city,
      state,
    })

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}

import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { ResourceNotFound } from "@/core/errors/resource-not-found"

import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientsRepository } from "../repositories/recipients-repository"

type EditRecipientUseCaseRequest = {
  recipientId: string
  latitude?: number
  longitude?: number
  zipCode?: string
  address?: string
  complement?: string | null
  district?: string
  city?: string
  state?: string
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFound,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    latitude,
    longitude,
    zipCode,
    address,
    complement,
    district,
    city,
    state,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFound())
    }

    recipient.latitude = latitude ?? recipient.latitude
    recipient.longitude = longitude ?? recipient.longitude
    recipient.zipCode = zipCode ?? recipient.zipCode
    recipient.address = address ?? recipient.address
    recipient.complement = complement ?? recipient.complement
    recipient.district = district ?? recipient.district
    recipient.city = city ?? recipient.city
    recipient.state = state ?? recipient.state

    await this.recipientsRepository.save(recipient)

    return right({ recipient })
  }
}

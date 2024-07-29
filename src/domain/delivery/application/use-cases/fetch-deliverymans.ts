import { Injectable } from "@nestjs/common"

import { Either, right } from "@/core/either"

import { Deliveryman } from "../../enterprise/entities/deliveryman"
import { DeliverymansRepository } from "../repositories/deliverymans-repository"

type FetchDeliverymansUseCaseResponse = Either<
  null,
  {
    deliverymans: Deliveryman[]
  }
>

@Injectable()
export class FetchDeliverymansUseCase {
  constructor(private deliverymansRepository: DeliverymansRepository) {}

  async execute(): Promise<FetchDeliverymansUseCaseResponse> {
    const deliverymans = await this.deliverymansRepository.findAll()

    return right({ deliverymans })
  }
}

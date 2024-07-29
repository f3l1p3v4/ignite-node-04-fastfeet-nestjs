import { Injectable } from "@nestjs/common"

import { Either, left, right } from "@/core/either"
import { InvalidAttachmentType } from "@/core/errors/invalid-attachment-type"

import { Attachment } from "../../enterprise/entities/attachment"
import { AttachmentsRepository } from "../repositories/attachments-repository"
import { Uploader } from "../storage/uploader"

type UploadAttachmentUseCaseRequest = {
  filename: string
  filetype: string
  body: Buffer
}

type UploadAttachmentUseCaseResponse = Either<
  InvalidAttachmentType,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    filename,
    filetype,
    body,
  }: UploadAttachmentUseCaseRequest): Promise<UploadAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png))/.test(filetype)) {
      return left(new InvalidAttachmentType(filetype))
    }

    const { url } = await this.uploader.upload({
      filename,
      filetype,
      body,
    })

    const attachment = Attachment.create({
      title: filename,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}

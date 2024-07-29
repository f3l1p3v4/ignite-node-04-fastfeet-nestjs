import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"

import { UploadAttachmentUseCase } from "@/domain/delivery/application/use-cases/upload-attachment"
import { RoleDecorator } from "@/infra/auth/role.decorator"

@Controller("/attachments")
@RoleDecorator("DELIVERYMAN")
export class UploadAttachmentController {
  constructor(private uploadAttachment: UploadAttachmentUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2 MB
          }),
          new FileTypeValidator({ fileType: ".(png|jpg|jpeg)" }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAttachment.execute({
      filename: file.originalname,
      filetype: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const { attachment } = result.value

    return {
      attachmentId: attachment.id.toString(),
    }
  }
}

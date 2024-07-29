import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository"
import { FakeUploader } from "test/storage/fake-uploader"

import { InvalidAttachmentType } from "@/core/errors/invalid-attachment-type"

import { UploadAttachmentUseCase } from "./upload-attachment"

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAttachmentUseCase

describe("UploadAttachmentUseCase", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it("should be able to upload a new attachment", async () => {
    const result = await sut.execute({
      body: Buffer.from(""),
      filename: "profile.png",
      filetype: "image/png",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })

    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({ filename: "profile.png" }),
    )
  })

  it("should not be able to upload an attachment with invalid file type", async () => {
    const result = await sut.execute({
      body: Buffer.from(""),
      filename: "profile.mp3",
      filetype: "audio/mpeg",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})

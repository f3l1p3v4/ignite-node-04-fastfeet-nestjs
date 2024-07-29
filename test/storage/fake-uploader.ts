import { randomUUID } from "node:crypto"

import {
  Uploader,
  UploadParams,
} from "@/domain/delivery/application/storage/uploader"

interface Upload {
  filename: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ filename }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      filename,
      url,
    })

    return { url }
  }
}

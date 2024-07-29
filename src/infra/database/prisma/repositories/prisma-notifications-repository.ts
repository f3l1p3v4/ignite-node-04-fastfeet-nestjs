import { Injectable } from "@nestjs/common"

import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository"
import { Notification } from "@/domain/notification/enterprise/entities/notification"

import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper"
import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = []

  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    })

    if (!notification) return null

    return PrismaNotificationMapper.toDomin(notification)
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.create({
      data,
    })
  }
}

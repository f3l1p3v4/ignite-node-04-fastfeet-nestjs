import { Module } from "@nestjs/common"

import { AdminsRepository } from "@/domain/delivery/application/repositories/admins-repository"
import { AttachmentsRepository } from "@/domain/delivery/application/repositories/attachments-repository"
import { DeliverymansRepository } from "@/domain/delivery/application/repositories/deliverymans-repository"
import { OrderAttachmentsRepository } from "@/domain/delivery/application/repositories/order-attachments-repository"
import { OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository"
import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository"
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository"

import { PrismaService } from "./prisma/prisma.service"
import { PrismaAdminsRepository } from "./prisma/repositories/prisma-admins-repository"
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository"
import { PrismaDeliverymansRepository } from "./prisma/repositories/prisma-deliverymans-repository"
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository"
import { PrismaOrderAttachmentsRepository } from "./prisma/repositories/prisma-order-attachments-repository"
import { PrismaOrdersRepository } from "./prisma/repositories/prisma-orders-repository"
import { PrismaRecipientsRepository } from "./prisma/repositories/prisma-recipients-repository"

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: DeliverymansRepository,
      useClass: PrismaDeliverymansRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: OrderAttachmentsRepository,
      useClass: PrismaOrderAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    DeliverymansRepository,
    RecipientsRepository,
    OrdersRepository,
    AttachmentsRepository,
    OrderAttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}

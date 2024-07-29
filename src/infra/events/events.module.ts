import { Module } from "@nestjs/common"

import { OnUpdateOrderStatus } from "@/domain/notification/application/subscribers/on-update-order-status"
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification"

import { DatabaseModule } from "../database/database.module"

@Module({
  imports: [DatabaseModule],
  providers: [OnUpdateOrderStatus, SendNotificationUseCase],
})
export class EventsModule {}

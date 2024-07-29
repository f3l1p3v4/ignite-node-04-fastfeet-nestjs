import { Module } from "@nestjs/common"

import { AuthenticateAdminUseCase } from "@/domain/delivery/application/use-cases/authenticate-admin"
import { AuthenticateDeliverymanUseCase } from "@/domain/delivery/application/use-cases/authenticate-deliveryman"
import { CreateDeliverymanUseCase } from "@/domain/delivery/application/use-cases/create-deliveryman"
import { CreateOrderUseCase } from "@/domain/delivery/application/use-cases/create-order"
import { CreateRecipientUseCase } from "@/domain/delivery/application/use-cases/create-recipient"
import { DeleteDeliverymanUseCase } from "@/domain/delivery/application/use-cases/delete-deliveryman"
import { DeleteOrderUseCase } from "@/domain/delivery/application/use-cases/delete-order"
import { DeleteRecipientUseCase } from "@/domain/delivery/application/use-cases/delete-recipient"
import { EditDeliverymanUseCase } from "@/domain/delivery/application/use-cases/edit-deliveryman"
import { EditRecipientUseCase } from "@/domain/delivery/application/use-cases/edit-recipient"
import { FetchDeliverymansUseCase } from "@/domain/delivery/application/use-cases/fetch-deliverymans"
import { FetchNearbyOrdersUseCase } from "@/domain/delivery/application/use-cases/fetch-nearby-orders"
import { FetchOrdersByDeliverymanUseCase } from "@/domain/delivery/application/use-cases/fetch-orders-by-deliveryman"
import { FetchRecipientsUseCase } from "@/domain/delivery/application/use-cases/fetch-recipients"
import { MarkOrderAsCollectedUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-collected"
import { MarkOrderAsDeliveredUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-delivered"
import { MarkOrderAsReturnedUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-returned"
import { RegisterAdminUseCase } from "@/domain/delivery/application/use-cases/register-admin"
import { UploadAttachmentUseCase } from "@/domain/delivery/application/use-cases/upload-attachment"

import { CryptographyModule } from "../cryptography/cryptography.module"
import { DatabaseModule } from "../database/database.module"
import { StorageModule } from "../storage/storage.module"
import { AuthenticateAdminController } from "./controllers/authenticate-admin.controller"
import { AuthenticateDeliverymanController } from "./controllers/authenticate-deliveryman.controller"
import { CreateDeliverymanController } from "./controllers/create-deliveryman.controller"
import { CreateOrderController } from "./controllers/create-order.controller"
import { CreateRecipientController } from "./controllers/create-recipient.controller"
import { DeleteDeliverymanController } from "./controllers/delete-deliveryman.controller"
import { DeleteOrderController } from "./controllers/delete-order.controller"
import { DeleteRecipientController } from "./controllers/delete-recipient.controller"
import { EditDeliverymanController } from "./controllers/edit-deliveryman.controller"
import { EditRecipientController } from "./controllers/edit-recipient.controller"
import { FetchDeliverymansController } from "./controllers/fetch-deliverymans.controller"
import { FetchNearbyOrdersController } from "./controllers/fetch-nearby-orders.controller"
import { FetchOrdersByDeliverymanController } from "./controllers/fetch-orders-by-deliveryman.controller"
import { FetchRecipientsController } from "./controllers/fetch-recipients.controller"
import { MarkOrderAsCollectedController } from "./controllers/mark-order-as-collected.controller"
import { MarkOrderAsDeliveredController } from "./controllers/mark-order-as-delivered.controller"
import { MarkOrderAsReturnedController } from "./controllers/mark-order-as-returned.controller"
import { RegisterAdminController } from "./controllers/register-admin.controller"
import { UploadAttachmentController } from "./controllers/upload-attachment.controller"

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterAdminController,
    AuthenticateAdminController,
    CreateDeliverymanController,
    EditDeliverymanController,
    DeleteDeliverymanController,
    FetchDeliverymansController,
    AuthenticateDeliverymanController,
    CreateRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    FetchRecipientsController,
    DeleteOrderController,
    CreateOrderController,
    MarkOrderAsCollectedController,
    MarkOrderAsReturnedController,
    MarkOrderAsDeliveredController,
    FetchOrdersByDeliverymanController,
    FetchNearbyOrdersController,
    UploadAttachmentController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateAdminUseCase,
    CreateDeliverymanUseCase,
    EditDeliverymanUseCase,
    DeleteDeliverymanUseCase,
    FetchDeliverymansUseCase,
    AuthenticateDeliverymanUseCase,
    CreateRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    FetchRecipientsUseCase,
    DeleteOrderUseCase,
    CreateOrderUseCase,
    MarkOrderAsCollectedUseCase,
    MarkOrderAsReturnedUseCase,
    MarkOrderAsDeliveredUseCase,
    FetchOrdersByDeliverymanUseCase,
    FetchNearbyOrdersUseCase,
    UploadAttachmentUseCase,
  ],
})
export class HttpModule {}

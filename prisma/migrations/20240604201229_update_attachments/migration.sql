-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_orderId_fkey";

-- AlterTable
ALTER TABLE "attachments" ALTER COLUMN "orderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

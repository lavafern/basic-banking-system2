-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_destination_account_id_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_source_account_id_fkey";

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_source_account_id_fkey" FOREIGN KEY ("source_account_id") REFERENCES "Bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_destination_account_id_fkey" FOREIGN KEY ("destination_account_id") REFERENCES "Bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

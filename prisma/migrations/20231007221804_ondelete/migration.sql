-- DropForeignKey
ALTER TABLE "Bank_accounts" DROP CONSTRAINT "Bank_accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_destination_account_id_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_source_account_id_fkey";

-- AddForeignKey
ALTER TABLE "Bank_accounts" ADD CONSTRAINT "Bank_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_source_account_id_fkey" FOREIGN KEY ("source_account_id") REFERENCES "Bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_destination_account_id_fkey" FOREIGN KEY ("destination_account_id") REFERENCES "Bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

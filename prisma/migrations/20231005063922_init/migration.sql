/*
  Warnings:

  - A unique constraint covering the columns `[bank_account_number]` on the table `Bank_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identity_number]` on the table `Profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bank_accounts_bank_account_number_key" ON "Bank_accounts"("bank_account_number");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_identity_number_key" ON "Profiles"("identity_number");

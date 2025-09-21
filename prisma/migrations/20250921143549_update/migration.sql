/*
  Warnings:

  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `DeviceId` on the `Reading` table. All the data in the column will be lost.
  - Added the required column `deviceId` to the `Reading` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reading" DROP CONSTRAINT "Reading_DeviceId_fkey";

-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Reading" DROP COLUMN "DeviceId",
ADD COLUMN     "deviceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

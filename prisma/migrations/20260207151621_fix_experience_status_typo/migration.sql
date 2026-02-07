/*
  Warnings:

  - The values [blocker] on the enum `ExperienceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExperienceStatus_new" AS ENUM ('draft', 'published', 'blocked');
ALTER TABLE "public"."experiences" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "experiences" ALTER COLUMN "status" TYPE "ExperienceStatus_new" USING ("status"::text::"ExperienceStatus_new");
ALTER TYPE "ExperienceStatus" RENAME TO "ExperienceStatus_old";
ALTER TYPE "ExperienceStatus_new" RENAME TO "ExperienceStatus";
DROP TYPE "public"."ExperienceStatus_old";
ALTER TABLE "experiences" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;

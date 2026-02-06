-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "status" "ExperienceStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "experiences_location_start_time_idx" ON "experiences"("location", "start_time");

-- CreateIndex
CREATE INDEX "experiences_created_by_idx" ON "experiences"("created_by");

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

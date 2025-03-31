-- CreateEnum
CREATE TYPE "Version" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('TASK_START', 'TASK_END', 'CASE_START', 'CASE_SUBMIT', 'CASE_ERROR', 'ORDER_SELECT');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('ORDER_ASSIGNMENT', 'ORDER_VALIDATION', 'DELIVERY_SCHEDULING');

-- CreateEnum
CREATE TYPE "ErrorType" AS ENUM ('SEQUENCE_ERROR', 'ZONE_MATCH_ERROR', 'VALIDATION_ERROR', 'SCHEDULING_ERROR');

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "age" TEXT,
    "gender" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "version" "Version" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionLog" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "task" "TaskType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "errorType" "ErrorType" NOT NULL,
    "task" "TaskType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActionLog_participantId_idx" ON "ActionLog"("participantId");

-- CreateIndex
CREATE INDEX "ErrorLog_participantId_idx" ON "ErrorLog"("participantId");

-- AddForeignKey
ALTER TABLE "ActionLog" ADD CONSTRAINT "ActionLog_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErrorLog" ADD CONSTRAINT "ErrorLog_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

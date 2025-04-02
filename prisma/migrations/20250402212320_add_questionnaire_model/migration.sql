-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "nasaTlxMental" INTEGER NOT NULL,
    "nasaTlxPhysical" INTEGER NOT NULL,
    "nasaTlxTemporal" INTEGER NOT NULL,
    "nasaTlxPerformance" INTEGER NOT NULL,
    "nasaTlxEffort" INTEGER NOT NULL,
    "nasaTlxFrustration" INTEGER NOT NULL,
    "susResponses" INTEGER[],
    "confidenceRating" INTEGER NOT NULL,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Questionnaire_participantId_idx" ON "Questionnaire"("participantId");

-- CreateIndex
CREATE INDEX "Questionnaire_version_idx" ON "Questionnaire"("version");

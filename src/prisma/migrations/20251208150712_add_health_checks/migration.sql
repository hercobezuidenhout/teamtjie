-- CreateTable
CREATE TABLE "HealthCheck" (
    "id" SERIAL NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "HealthCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCheckQuestion" (
    "id" SERIAL NOT NULL,
    "healthCheckId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "HealthCheckQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCheckResponse" (
    "id" SERIAL NOT NULL,
    "healthCheckId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "HealthCheckResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCheckAnswer" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "HealthCheckAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HealthCheck_scopeId_createdAt_idx" ON "HealthCheck"("scopeId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "HealthCheckQuestion_healthCheckId_idx" ON "HealthCheckQuestion"("healthCheckId");

-- CreateIndex
CREATE INDEX "HealthCheckResponse_healthCheckId_idx" ON "HealthCheckResponse"("healthCheckId");

-- CreateIndex
CREATE INDEX "HealthCheckResponse_userId_idx" ON "HealthCheckResponse"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthCheckResponse_healthCheckId_userId_key" ON "HealthCheckResponse"("healthCheckId", "userId");

-- CreateIndex
CREATE INDEX "HealthCheckAnswer_questionId_idx" ON "HealthCheckAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthCheckAnswer_responseId_questionId_key" ON "HealthCheckAnswer"("responseId", "questionId");

-- AddForeignKey
ALTER TABLE "HealthCheck" ADD CONSTRAINT "HealthCheck_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheck" ADD CONSTRAINT "HealthCheck_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheckQuestion" ADD CONSTRAINT "HealthCheckQuestion_healthCheckId_fkey" FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheckResponse" ADD CONSTRAINT "HealthCheckResponse_healthCheckId_fkey" FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheckResponse" ADD CONSTRAINT "HealthCheckResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheckAnswer" ADD CONSTRAINT "HealthCheckAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "HealthCheckResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheckAnswer" ADD CONSTRAINT "HealthCheckAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "HealthCheckQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

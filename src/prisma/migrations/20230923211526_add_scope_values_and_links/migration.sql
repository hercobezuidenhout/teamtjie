-- AlterTable
ALTER TABLE "Scope" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "ScopeValue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scopeId" INTEGER NOT NULL,

    CONSTRAINT "ScopeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopeLink" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL,

    CONSTRAINT "ScopeLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScopeValue_scopeId_name_key" ON "ScopeValue"("scopeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ScopeLink_scopeId_title_key" ON "ScopeLink"("scopeId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "ScopeLink_scopeId_url_key" ON "ScopeLink"("scopeId", "url");

-- AddForeignKey
ALTER TABLE "ScopeValue" ADD CONSTRAINT "ScopeValue_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeLink" ADD CONSTRAINT "ScopeLink_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

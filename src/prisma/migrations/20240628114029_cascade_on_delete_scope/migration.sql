-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_scopeId_scope_fk";

-- DropForeignKey
ALTER TABLE "Scope" DROP CONSTRAINT "Scope_parentScopeId_fkey";

-- DropForeignKey
ALTER TABLE "ScopeRole" DROP CONSTRAINT "ScopeRole_userId_fkey";

-- AddForeignKey
ALTER TABLE "Scope" ADD CONSTRAINT "Scope_parentScopeId_fkey" FOREIGN KEY ("parentScopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeRole" ADD CONSTRAINT "ScopeRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_scopeId_scope_fk" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

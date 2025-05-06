import prisma from "../prisma";

/**
 * Gets all of the scopes for a given parentScopeId
 */
export const getAllScopesForParentScope = async (parentScopeIds: number[]) =>
    await prisma.scope.findMany({
        where: {
            parentScopeId: { in: parentScopeIds }
        }
    });
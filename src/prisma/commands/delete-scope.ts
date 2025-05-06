import prisma from "../prisma";

export const deleteScope = async (scopeId: number) => {
    await prisma.scope.delete({
        where: {
            id: scopeId
        },
        include: {
            childScopes: true,
            featureFlagOverrides: true,
            invitations: true,
            posts: true,
            roles: true,
            scopeLinks: true,
            ScopePostPermission: true,
            scopeValues: true
        }
    });
};
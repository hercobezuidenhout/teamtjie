import prisma from '@/prisma/prisma';
import { ScopeType } from '@prisma/client';

/**
 * Get the first space ID for a user (ordered by name)
 * Used for direct redirect from root to avoid double redirects
 */
export const getFirstSpaceId = async (userId: string): Promise<number | null> => {
    const scope = await prisma.scope.findFirst({
        where: {
            roles: { some: { userId } },
            type: ScopeType.SPACE
        },
        select: { id: true },
        orderBy: { name: 'asc' }
    });

    return scope?.id ?? null;
};
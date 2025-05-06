import prisma from "../prisma";

export const getPostUsageForScope = async (scopeId: number) => {
    const result = await prisma.post.groupBy({
        by: ['createdAt', 'type'],
        where: {
            scopeId: scopeId,
            createdAt: {
                gte: new Date('2024-09-01'),
                lte: new Date('2024-09-30'),
            },
        },
        _count: {
            id: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    const data = result.map(entry => ({
        date: entry.createdAt.toISOString().split('T')[0],
        type: entry.type,
        count: entry._count.id,
    }));

    return data;
};
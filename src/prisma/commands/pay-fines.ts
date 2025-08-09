import prisma from "../prisma";

interface PayFinesCommand {
    issuedById: string;
    paymentId: number;
    scopeId: number;
}

export const payFines = async ({ issuedById, paymentId, scopeId }: PayFinesCommand) => {
    const userPaidFines = await prisma.paidFine.findMany({
        where: {
            userId: issuedById
        }
    });

    const availableFine = await prisma.post.findFirst({
        where: {
            id: {
                notIn: userPaidFines.map(paidFine => paidFine.fineId)
            },
            issuedToId: issuedById,
            type: 'FINE',
            scopeId: scopeId
        }
    });

    if (availableFine) {
        await prisma.paidFine.create({
            data: {
                fineId: availableFine.id,
                userId: issuedById,
                paymentId: paymentId
            }
        });
    }
};
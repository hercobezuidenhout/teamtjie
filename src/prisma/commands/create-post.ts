import prisma from '@/prisma/prisma';
import { PostType } from '@prisma/client';

export interface CreatePostCommand {
    description: string;
    issuedById: string;
    issuedToId?: string;
    scopeId: number;
    scopeValueIds?: number[];
    type: PostType;
}

export const createPost = async ({
    description,
    issuedById,
    issuedToId,
    scopeId,
    scopeValueIds,
    type
}: CreatePostCommand) => {
    const data = issuedToId
        ? {
            description: description,
            values: {
                create: scopeValueIds?.map((id) => ({ scopeValueId: id })),
            },
            issuedBy: { connect: { id: issuedById } },
            issuedTo: { connect: { id: issuedToId } },
            scope: { connect: { id: scopeId } },
            type: type
        }
        : {
            description: description,
            values: {
                create: scopeValueIds?.map((id) => ({ scopeValueId: id })),
            },
            issuedBy: { connect: { id: issuedById } },
            scope: { connect: { id: scopeId } },
            type: type
        };

    const response = await prisma.post.create({
        data: data
    });

    return response;
};

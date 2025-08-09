import { PostType } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
    issuedToId?: string = '';

    @IsNotEmpty()
    scopeId = 0;

    @IsNotEmpty()
    description = '';

    valueIds?: number[] | undefined = undefined;

    type: PostType = 'FINE';
}

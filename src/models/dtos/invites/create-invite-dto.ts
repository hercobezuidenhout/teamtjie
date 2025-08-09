import { IsNotEmpty } from 'class-validator';

export class CreateInviteDto {
    @IsNotEmpty()
    scopeId = -1;

    @IsNotEmpty()
    defaultRole = 'MEMBER';
}

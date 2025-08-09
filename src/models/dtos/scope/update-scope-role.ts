import { IsNotEmpty } from 'class-validator';

export class UpdateScopeRoleDto {
  @IsNotEmpty()
  userId = '';

  @IsNotEmpty()
  newRole = '';

  @IsNotEmpty()
  currentRole = '';
}

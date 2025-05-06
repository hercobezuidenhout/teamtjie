import { IsNotEmpty } from 'class-validator';

export class RemoveScopeRoleDto {
  @IsNotEmpty()
  userId = '';

  @IsNotEmpty()
  role = '';
}

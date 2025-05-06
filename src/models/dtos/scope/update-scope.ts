import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateScopeDto {
  @IsNotEmpty()
  @MinLength(5)
  name = '';

  description: string | undefined = undefined;
}

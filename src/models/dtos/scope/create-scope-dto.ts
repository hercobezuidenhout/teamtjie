import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateScopeDto {
  @IsNotEmpty()
  @MinLength(5)
  name = '';

  @IsNotEmpty()
  @MinLength(5)
  description = '';

  parentScopeId? = 0;

  type: 'TEAM' | 'SPACE' = 'SPACE';
}

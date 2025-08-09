import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateScopeLinkDto {
  @IsNotEmpty()
  @MinLength(5)
  url = '';

  @IsNotEmpty()
  @MinLength(5)
  title = '';

  isPublic = false;
}

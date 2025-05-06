import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateScopeLinkDto {
  @IsNotEmpty()
  @MinLength(5)
  url = '';

  @IsNotEmpty()
  @MinLength(5)
  title = '';

  isPublic = false;
}

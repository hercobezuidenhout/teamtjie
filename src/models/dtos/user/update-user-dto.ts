import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(5)
  name = '';

  aboutMe: string | null = null;
}

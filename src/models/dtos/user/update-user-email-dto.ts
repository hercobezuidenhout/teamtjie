import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserEmailDto {
  @IsNotEmpty()
  @MinLength(5)
  email = '';
}

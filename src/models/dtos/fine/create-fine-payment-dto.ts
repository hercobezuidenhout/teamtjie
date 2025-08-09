import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateFinePaymentDto {
  @IsNotEmpty()
  @MinLength(5)
  description = '';
}

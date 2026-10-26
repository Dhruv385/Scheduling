import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateDTO {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsAlpha()
  @IsNotEmpty()
  balance: number;
}

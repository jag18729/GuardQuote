import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  user_type?: string = 'individual';

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

import { IsString, IsOptional, IsNumber, IsDecimal } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  quote_type: string;

  @IsOptional()
  @IsString()
  status?: string = 'pending';

  @IsOptional()
  @IsDecimal()
  estimated_amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverage_type?: string;

  @IsOptional()
  @IsString()
  coverage_level?: string;

  @IsOptional()
  health_info?: any;

  @IsOptional()
  @IsString()
  employment_status?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsNumber()
  num_employees?: number;

  @IsOptional()
  @IsDecimal()
  annual_revenue?: number;

  @IsOptional()
  business_info?: any;
}

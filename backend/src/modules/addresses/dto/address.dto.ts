import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @IsString()
  @ApiProperty()
  address_line_1: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address_line_2: string;

  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @ApiProperty()
  postal_code: string;

  @IsString()
  @ApiProperty()
  country: string;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  address_line_1: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address_line_2: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  city: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  postal_code: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  country: string;
}

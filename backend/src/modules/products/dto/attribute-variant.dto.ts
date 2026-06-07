import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttributeVariantDto {
  @IsNumber()
  @ApiProperty()
  attribute_id: number;

  @IsString()
  @ApiProperty()
  value: string;
}

export class UpdateAttributeVariantDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  value?: string;
}

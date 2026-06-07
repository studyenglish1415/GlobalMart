import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttributeDto {
  @IsNumber()
  @ApiProperty()
  product_id: number;

  @IsString()
  @ApiProperty()
  name: string;
}

export class UpdateAttributeDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;
}

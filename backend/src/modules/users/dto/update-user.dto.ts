import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  first_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;
}

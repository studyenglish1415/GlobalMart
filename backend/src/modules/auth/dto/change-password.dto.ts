import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  old_password: string;

  @IsString()
  @MinLength(6)
  @ApiProperty()
  new_password: string;
}

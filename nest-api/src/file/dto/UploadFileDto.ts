import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  brand_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  auth_user_id: number;
}

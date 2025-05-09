import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  auth_user_id: number;
}

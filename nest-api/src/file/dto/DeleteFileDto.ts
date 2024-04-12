import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class DeleteFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  auth_user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cid: string;
}

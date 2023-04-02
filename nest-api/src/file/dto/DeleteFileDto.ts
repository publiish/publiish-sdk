import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  brand_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  auth_user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cid: string;
}

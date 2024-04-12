import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  brand_name: string;

  @ApiProperty()
  dao_id: string;

  @ApiProperty()
  @IsString()
  brand_url: string;

  @ApiProperty()
  sub_domain: string;
}

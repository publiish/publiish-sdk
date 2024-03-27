import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateKeyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

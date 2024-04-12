import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDateString,
  IsNumberString,
} from 'class-validator';

export class ApikeyDto {
  @ApiProperty()
  @IsBooleanString()
  isDefault: boolean;

  @ApiProperty()
  @IsNumberString()
  storageSize: number;

  @ApiProperty()
  @IsDateString()
  expireAt: string;

  @ApiProperty()
  @IsBooleanString()
  writePermission: boolean;

  @ApiProperty()
  @IsBooleanString()
  deletePermission: boolean;
}

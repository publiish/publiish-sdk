import { IsEmail, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsNumberString()
  brand_id: number;

  @IsNotEmpty()
  @IsNumberString()
  auth_user_id: number;
}

import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Redirect,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from './auth.service';
import { SigninResponse, SignupResponse } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignUpDto): Promise<SignupResponse> {
    const { email, password, brand_name } = body;

    return this.authService.signup(email, password, brand_name);
  }

  @Post('signin')
  signin(@Body() body: SignInDto): Promise<SigninResponse> {
    const { email, password } = body;

    return this.authService.signin(email, password);
  }
}

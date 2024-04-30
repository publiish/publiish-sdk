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
  Headers,
  Req,
} from '@nestjs/common';
import { SignInDto, SignUpDto, PermissionDto } from './dto/index.js';
import { AuthService } from './auth.service.js';
import {
  SigninResponse,
  SignupResponse,
  BrandResponse,
  PermissionResponse,
} from './types.js';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(
    @Req() req: Request,
    @Body() body: SignUpDto
  ): Promise<SignupResponse> {
    req.headers
    const { email, brand_name } = body;
    return this.authService.signup(req, brand_name);
  }

  @Post('signin')
  signin(
    @Req() req: Request,
    @Headers('referer') referer?: string,
  ): Promise<SigninResponse> {
    return this.authService.signin(req);
  }

  @Post('change_permission')
  change_permission(@Body() body: PermissionDto): Promise<PermissionResponse> {
    const { id, coloumn, action } = body;
    return this.authService.change_permission(id, coloumn, action);
  }
  
  @Get('brands')
  brands(): Promise<BrandResponse> {
    return this.authService.get_brands();
  }
}

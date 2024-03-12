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
} from '@nestjs/common';
import { SignInDto, SignUpDto, PermissionDto } from './dto';
import { AuthService } from './auth.service';
import {
  SigninResponse,
  SignupResponse,
  BrandResponse,
  PermissionResponse,
} from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignUpDto): Promise<SignupResponse> {
    const { email, password, brand_name } = body;

    return this.authService.signup(email, password, brand_name);
  }

  @Post('signin')
  signin(
    @Body() body: SignInDto,
    @Headers('referer') referer?: string,
  ): Promise<SigninResponse> {
    const { email, password } = body;

    return this.authService.signin(email, password, referer);
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

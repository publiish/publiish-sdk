import { Test, TestingModule } from '@nestjs/testing';
import { testTypeORMModule } from 'test/test-provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brand/brand.entity';
import { File } from 'src/file/file.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SIGNIN_RESPONSE_MOCK, SIGNUP_RESPONSE_MOCK } from './mocks';
import { ValidationException } from 'src/common/error/validation-exception';
import { ValidationError } from 'class-validator';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  let signUpSpy: jest.SpyInstance;
  let signInSpy: jest.SpyInstance;

  let result: unknown;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [testTypeORMModule, TypeOrmModule.forFeature([Brand])],
      controllers: [AuthController],
      providers: [AuthService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#AUTH /signup', () => {
    describe('with valid params', () => {
      let body = {
        brand_name: SIGNUP_RESPONSE_MOCK.brand.brand_name,
        email: SIGNUP_RESPONSE_MOCK.brand.email,
        password: 'Password12@',
      };

      beforeEach(async () => {
        signUpSpy = jest
          .spyOn(service, 'signup')
          .mockImplementation(async () => SIGNUP_RESPONSE_MOCK);

        result = await controller.signup(body);
      });

      it('should create and return user', () => {
        expect(signUpSpy).toHaveBeenCalledTimes(1);
        expect(signUpSpy).toHaveBeenCalledWith(
          body.email,
          body.password,
          body.brand_name,
        );

        expect(result).toBeDefined();
        expect(result).toHaveProperty('status', expect.any(Number));
        expect(result).toHaveProperty('success', expect.any(String));
        expect(result).toStrictEqual(SIGNUP_RESPONSE_MOCK);
      });
    });

    describe('with invalid params', () => {
      let body = {
        brand_name: '2',
        email: 'invalid',
        password: 'ss',
      };

      beforeEach(async () => {
        signUpSpy = jest
          .spyOn(service, 'signup')
          .mockRejectedValue(new ValidationException([new ValidationError()]));
      });

      it('should create and return user', async () => {
        await expect(controller.signup(body)).rejects.toBeInstanceOf(
          ValidationException,
        );

        expect(signUpSpy).toHaveBeenCalledTimes(1);
        expect(signUpSpy).toHaveBeenCalledWith(
          body.email,
          body.password,
          body.brand_name,
        );
      });
    });
  });

  describe('#AUTH /signin', () => {
    describe('with valid params', () => {
      let body = {
        email: SIGNUP_RESPONSE_MOCK.brand.email,
        password: 'Password12@',
      };

      beforeEach(async () => {
        signInSpy = jest
          .spyOn(service, 'signin')
          .mockImplementation(async () => SIGNIN_RESPONSE_MOCK);

        result = await controller.signin(body, 'referer header');
      });

      it('should login and return token', () => {
        expect(signInSpy).toHaveBeenCalledTimes(1);
        expect(signInSpy).toHaveBeenCalledWith(
          body.email,
          body.password,
          'referer header',
        );

        expect(result).toBeDefined();
        expect(result).toHaveProperty('status', expect.any(Number));
        expect(result).toHaveProperty('success', expect.any(String));
        expect(result).toStrictEqual(SIGNIN_RESPONSE_MOCK);
      });
    });

    describe('with invalid params', () => {
      let body = {
        email: 'invalid',
        password: 'ss',
      };

      beforeEach(async () => {
        signInSpy = jest
          .spyOn(service, 'signin')
          .mockRejectedValue(new ValidationException([new ValidationError()]));
      });

      it('should create and return user', async () => {
        await expect(
          controller.signin(body, 'referer header'),
        ).rejects.toBeInstanceOf(ValidationException);

        expect(signInSpy).toHaveBeenCalledTimes(1);
        expect(signInSpy).toHaveBeenCalledWith(
          body.email,
          body.password,
          'referer header',
        );
      });
    });
  });
});

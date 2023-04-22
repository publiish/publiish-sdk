import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { TEST_PROVIDER, testTypeORMModule } from 'test/test-provider';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Brand } from 'src/brand/brand.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Repository, getRepository } from 'typeorm';
import { BRAND_MOCK } from 'src/brand/mocks';
import {
  PASSWORD_HASH_MOCK,
  SIGNIN_RESPONSE_MOCK,
  SIGNUP_RESPONSE_MOCK,
} from './mocks';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  let brandRepository: Repository<Brand>;
  let jwtService: JwtService;

  let brandRepositoryFindOneSpy: jest.SpyInstance;
  let brandRepositorySaveSpy: jest.SpyInstance;

  let jwtServiceSignSpy: jest.SpyInstance;

  let bcryptCompareSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthService],
      providers: [TEST_PROVIDER.BRAND_REPO, AuthService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    brandRepository = module.get<Repository<Brand>>(getRepositoryToken(Brand));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ===== signUpMethod
  describe('#API signup service method', () => {
    describe('with valid input', () => {
      let body = {
        brand_name: SIGNUP_RESPONSE_MOCK.brand.brand_name,
        email: SIGNUP_RESPONSE_MOCK.brand.email,
        password: 'Password12@',
      };

      beforeEach(() => {
        brandRepositoryFindOneSpy = jest
          .spyOn(brandRepository, 'findOne')
          .mockResolvedValue(undefined);

        brandRepositorySaveSpy = jest
          .spyOn(brandRepository, 'save')
          .mockResolvedValue(BRAND_MOCK);

        brandRepositoryFindOneSpy.mockClear();
        brandRepositorySaveSpy.mockClear();
      });

      it('should create user and return it', async () => {
        expect(
          await service.signup(body.email, body.password, body.brand_name),
        ).toStrictEqual(SIGNUP_RESPONSE_MOCK);

        expect(brandRepositoryFindOneSpy).toBeCalledTimes(1);
        expect(brandRepositoryFindOneSpy.mock.calls[0][0].where).toEqual(
          expect.arrayContaining([
            { email: BRAND_MOCK.email },
            { brand_name: BRAND_MOCK.brand_name },
          ]),
        );

        expect(brandRepositorySaveSpy).toBeCalledTimes(1);
        expect(brandRepositorySaveSpy).toBeCalledWith({
          brand_name: SIGNUP_RESPONSE_MOCK.brand.brand_name,
          email: SIGNUP_RESPONSE_MOCK.brand.email,
          password: expect.any(String),
        });
      });
    });

    describe('with existing account', () => {
      let body = {
        brand_name: SIGNUP_RESPONSE_MOCK.brand.brand_name,
        email: SIGNUP_RESPONSE_MOCK.brand.email,
        password: 'Password12@',
      };

      beforeEach(() => {
        brandRepositoryFindOneSpy = jest
          .spyOn(brandRepository, 'findOne')
          .mockResolvedValue(BRAND_MOCK);

        brandRepositoryFindOneSpy.mockClear();
        brandRepositorySaveSpy.mockClear();
      });

      it('should throw a HttpException', async () => {
        await expect(
          service.signup(body.email, body.password, body.brand_name),
        ).rejects.toThrow(HttpException);
        expect(brandRepositoryFindOneSpy).toBeCalledTimes(1);
        expect(brandRepositoryFindOneSpy.mock.calls[0][0].where).toEqual(
          expect.arrayContaining([
            { email: BRAND_MOCK.email },
            { brand_name: BRAND_MOCK.brand_name },
          ]),
        );

        expect(brandRepositorySaveSpy).not.toBeCalled();
      });
    });
  });

  // ===== signInMethod
  describe('#API signin service method', () => {
    describe('with valid input', () => {
      let body = {
        email: SIGNUP_RESPONSE_MOCK.brand.email,
        password: 'Password12@',
      };

      beforeEach(async () => {
        brandRepositoryFindOneSpy = jest
          .spyOn(brandRepository, 'findOne')
          .mockResolvedValue({
            ...BRAND_MOCK,
            password: await PASSWORD_HASH_MOCK(),
          } as Brand);

        jwtServiceSignSpy = jest
          .spyOn(jwtService, 'signAsync')
          .mockResolvedValue(SIGNIN_RESPONSE_MOCK.access_token);

        brandRepositoryFindOneSpy.mockClear();
        jwtServiceSignSpy.mockClear();
      });

      it('should sign user in and return access_token', async () => {
        expect(await service.signin(body.email, body.password)).toStrictEqual(
          SIGNIN_RESPONSE_MOCK,
        );

        expect(brandRepositoryFindOneSpy).toBeCalledTimes(1);
        expect(brandRepositoryFindOneSpy).toHaveBeenCalledWith({
          where: { email: BRAND_MOCK.email },
        });

        expect(jwtServiceSignSpy).toBeCalledTimes(1);
        expect(jwtServiceSignSpy).toHaveBeenCalledWith({
          email: BRAND_MOCK.email,
          brand_name: BRAND_MOCK.brand_name,
          brand_url: BRAND_MOCK.brand_url,
          id: BRAND_MOCK.id,
        });
      });
    });

    describe('with non existing account', () => {
      let body = {
        email: SIGNUP_RESPONSE_MOCK.brand.email,
        password: 'Password12@',
      };

      beforeEach(() => {
        brandRepositoryFindOneSpy = jest
          .spyOn(brandRepository, 'findOne')
          .mockResolvedValue(undefined);

        brandRepositoryFindOneSpy.mockClear();
        jwtServiceSignSpy.mockClear();
      });

      it('should throw a HttpException', async () => {
        await expect(service.signin(body.email, body.password)).rejects.toThrow(
          HttpException,
        );

        expect(brandRepositoryFindOneSpy).toBeCalledTimes(1);
        expect(brandRepositoryFindOneSpy).toHaveBeenCalledWith({
          where: { email: BRAND_MOCK.email },
        });

        expect(jwtServiceSignSpy).not.toBeCalled();
      });
    });
  });
});

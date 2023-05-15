import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { SIGNIN_RESPONSE_MOCK, SIGNUP_RESPONSE_MOCK } from './mocks';
import { TEST_PROVIDER, testTypeORMModule } from 'test/test-provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brand/brand.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

describe('Cats', () => {
  let app: INestApplication;
  let authService = {
    signup: () => SIGNUP_RESPONSE_MOCK,
    signin: () => SIGNIN_RESPONSE_MOCK,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        testTypeORMModule,
        TypeOrmModule.forFeature([Brand]),
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1H' },
        }),
        AuthModule,
      ],
      controllers: [AuthController],
      providers: [TEST_PROVIDER.BRAND_REPO, AuthService, JwtService],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST auth/signup`, async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        brand_name: SIGNUP_RESPONSE_MOCK.brand.brand_name,
        email: SIGNUP_RESPONSE_MOCK.brand.email,
        password: 'Password12@',
      })
      .expect(201);

    expect(response.body).toEqual({ ...SIGNUP_RESPONSE_MOCK, brand: [] });
  });

  it(`/POST auth/signin`, async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: SIGNUP_RESPONSE_MOCK.brand.email,
        password: 'Password12@',
      })
      .expect(201);

    expect(response.body).toEqual(SIGNIN_RESPONSE_MOCK);
  });

  afterAll(async () => {
    await app.close();
  });
});

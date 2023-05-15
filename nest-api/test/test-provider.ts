import { Provider } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { mock } from 'jest-mock-extended';
import { config } from 'dotenv';
import { Repository } from 'typeorm';
import { Brand } from 'src/brand/brand.entity';
config();

const provideRepository = (provider: EntityClassOrSchema): Provider => ({
  provide: getRepositoryToken(provider),
  useValue: mock(Repository<typeof provider>),
});

export const testTypeORMModule = TypeOrmModule.forRootAsync({
  useFactory: async () => ({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DATABASE_USER,
    // password:
    //   process.env.NODE_ENV !== 'development' &&
    //   process.env.DATABASE_PASSWORD,
    // password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    extra: {
      connectionLimit: 10,
      waitForConnections: true,
    },
  }),
});

export const TEST_PROVIDER = {
  BRAND_REPO: provideRepository(Brand),
};

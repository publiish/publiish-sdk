import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from './file/file.module.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BrandModule } from './brand/brand.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { IpnsModule } from './ipns/ipns.module.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ApikeyModule } from './apikey/apikey.module.js';
import { UcanModule } from './ucan/ucan.module.js';
import { DidModule } from './did/did.module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1H' },
    }),
    AuthModule,
    ApikeyModule,
    FileModule,
    IpnsModule,
    BrandModule,
    UcanModule,
    DidModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client'),
      serveRoot: '/admin',
      exclude: ['/api/(.*)'],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 50,
    }),
  ],
  providers: [
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

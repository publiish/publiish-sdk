import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client'),
      serveRoot: '/admin',
      exclude: ['/api/(.*)'],
    }),
  ],
  providers: [ConfigService],
})
export class AppModule {}

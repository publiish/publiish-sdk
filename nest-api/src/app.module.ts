import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, FileModule],
})
export class AppModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { testTypeORMModule } from 'test/test-provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brand/brand.entity';
import { FileController } from './file.controller';
import { File } from 'src/file/file.entity';
import { JwtService } from '@nestjs/jwt';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [testTypeORMModule, TypeOrmModule.forFeature([File, Brand])],
      controllers: [FileController],
      providers: [FileService, JwtService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UploadedFileEntity } from '../../database/entities/uploaded-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedFileEntity])],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule { }

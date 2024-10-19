import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { gridFsStorage } from '../configs/gridfs.config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: gridFsStorage,
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

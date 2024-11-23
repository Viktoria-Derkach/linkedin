import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    const storage = new GridFsStorage({
      url: 'mongodb://admin:admin@localhost:27019/linkedin?authSource=admin', // Your MongoDB connection string
      file: (req, file) => {
        return {
          filename: `${Date.now()}-${file.originalname}`,
        };
      },
    });

    return {
      storage,
    };
  }
}

import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('files')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('heee', file);

    return { message: 'File uploaded successfully', file };
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: any) {
    await this.uploadService.streamFileById(id, res);
  }
}

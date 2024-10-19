import { Injectable } from '@nestjs/common';
import { GridFSBucket, ObjectId } from 'mongodb';
import { getGridFSBucket } from '../configs/gridfs.config';
@Injectable()
export class UploadService {
  private bucket: GridFSBucket;

  constructor() {
    getGridFSBucket().then((bucket) => {
      this.bucket = bucket;
    });
  }

  async findFileById(id: string) {
    const fileId = new ObjectId(id);
    const cursor = this.bucket.find({ _id: fileId });
    return await cursor.toArray();
  }

  async streamFileById(id: string, res: any) {
    const fileId = new ObjectId(id);
    const downloadStream = this.bucket.openDownloadStream(fileId);

    downloadStream.pipe(res);
  }
}

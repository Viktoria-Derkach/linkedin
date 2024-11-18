import { GridFSBucket, MongoClient } from 'mongodb';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';

// MongoDB connection string with credentials
const mongoURI =
  'mongodb://localhost:27017/linkedin';

// GridFS Storage configuration
export const gridFsStorage = (): MulterModuleOptions => {
  const storage = new GridFsStorage({
    url: mongoURI,
    options: {
      useNewUrlParser: true, // Ensure the connection uses the latest parser
      useUnifiedTopology: true, // Ensure proper connection management
    },
    file: (req, file) => {
      return {
        filename: `${Date.now()}-file-${file.originalname}`, // Custom file name format
        bucketName: 'uploads', // Optional: Custom GridFS bucket name (default is fs)
      };
    },
  });

  return {
    storage,
  };
};

// Function to get GridFSBucket instance
export const getGridFSBucket = async (): Promise<GridFSBucket> => {
  const client = await MongoClient.connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  const db = client.db('linkedin'); // Connect to the correct database
  return new GridFSBucket(db, {
    bucketName: 'uploads', // Optional: Same bucket name used in file upload
  });
};

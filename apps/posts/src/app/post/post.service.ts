import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../models/post.model';
import { Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>
  ) {}

  createPost(post: CreatePostDto & { userId: string }) {
    console.log('her');

    const newPost = new this.postModel(post);
    return newPost.save();
  }
}

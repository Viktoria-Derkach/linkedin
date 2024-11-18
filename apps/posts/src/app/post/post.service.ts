import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../models/post.model';
import { Model } from 'mongoose';
import { VoteDto } from '../dtos/vote.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  createPost(post: CreatePostDto & { userId: string }) {
    console.log(post, 'her');

    if (post.type === 'text') {
      const newPost = new this.postModel(post);
      return newPost.save();
    }
    if (post.type === 'poll') {
      const { poll, ...rest } = post;
      const { question, options } = poll;
      const votes = Array(options.length).fill(0);
      const newPost = new this.postModel({
        ...rest,
        poll: { question, options, votes },
      });
      return newPost.save();
    }
  }

  async getPosts() {
    console.log('INSIDE SERVICE');

    const postsData = await this.postModel.find({});


    return postsData;

    // return this.postModel.find({});
    // return this.cacheManager.get('key1');
  }

  async getPost(id: string): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async vote(id: string, voteDto: VoteDto): Promise<Post> {
    const post = await this.getPost(id);
    if (post.poll) {
      const optionIndex = post.poll.options.indexOf(voteDto.option);
      if (optionIndex === -1) {
        throw new NotFoundException('Option not found');
      }
      post.poll.votes[optionIndex] += 1;
      return post.save();
    }
    throw new Error('The post is not a poll');
  }
}

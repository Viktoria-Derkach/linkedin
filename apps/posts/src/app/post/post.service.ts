import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../models/post.model';
import { Model } from 'mongoose';
import { VoteDto } from '../dtos/vote.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>
  ) {}

  createPost(post: CreatePostDto & { userId: string }) {
    console.log('her');

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

  getPosts() {
    console.log('her');

    return this.postModel.find({});
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

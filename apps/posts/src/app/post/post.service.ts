import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dtos/create-post.dto';
import { VoteDto } from '../dtos/vote.dto';
import { Post } from '../models/post.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  createPost(post: CreatePostDto & { userId: string }) {
    const meta = {
      created_at: new Date(),
      interacted_at: new Date(),
      updated_at: new Date(),
    };
    if (post.type === 'text') {
      const newPost = new this.postModel({ ...post, meta });
      return newPost.save();
    }
    if (post.type === 'poll') {
      const { poll, ...rest } = post;
      const { question, options } = poll;
      const votes = Array(options.length).fill(0);
      const newPost = new this.postModel({
        ...rest,
        poll: { question, options, votes },
        meta,
      });
      return newPost.save();
    }
  }

  async getPosts(page: number, perPage: number, filters: any) {
    console.log(page, perPage, filters, 'INSIDE SERVICE');

    const posts = await this.postModel
      .find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ 'meta.interacted_at': -1 })
      .exec();

    // const postsData = await this.postModel.find({});

    // return {posts, };

    const total = await this.postModel.countDocuments(filters);

    return {
      posts,
      meta: {
        pagination: {
          total,
          count: posts.length,
          per_page: perPage,
          current_page: page,
          total_pages: Math.ceil(total / perPage),
          links: [],
        },
      },
    };
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

  async findById(id: string) {
    return this.postModel.findById(id).exec();
  }

  async deletePost(id: string) {
    return this.postModel.findByIdAndDelete(id).exec();
  }
}

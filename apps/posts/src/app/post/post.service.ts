import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { VoteDto } from '../dtos/vote.dto';
import { Post } from '../models/post.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>
  ) {}

  createPost(post: CreatePostDto & { userId: string }) {
    const meta = {
      createdAt: new Date(),
      interactedAt: new Date(),
      updatedAt: new Date(),
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

    if (post.type === 'event') {
      const newPost = new this.postModel({
        ...post,
        meta,
      });
      return newPost.save();
    }
  }

  async updatePost(newPost: UpdatePostDto, id: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const meta = {
      createdAt: post.meta.createdAt,
      interactedAt: post.meta.interactedAt,
      updatedAt: new Date(),
    };
    if (post.type === 'text') {
      const updatedPost = await this.postModel.findByIdAndUpdate(
        id,
        {
          ...newPost,
          meta,
        },
        { new: true }
      );

      return updatedPost;
    }
    if (post.type === 'poll') {
      const { poll } = newPost;
      const { question, options } = poll;

      const votes = Array(options.length).fill(0);
      const updatedPost = await this.postModel.findByIdAndUpdate(
        id,
        {
          poll: { question, options, votes },
          meta,
        },
        { new: true }
      );
      return updatedPost;
    }

    if (post.type === 'event') {
      console.log(newPost, 'newPost');

      const updatedPost = await this.postModel.findByIdAndUpdate(
        id,
        {
          ...newPost,
          meta,
        },
        { new: true }
      );
      return updatedPost;
    }
  }

  async getPosts(
    page: number,
    perPage: number,
    sortBy: string,
    sortDir: string,
    type: string,
    userId: string,
    filters?: any
  ) {
    console.log(page, perPage, sortDir, filters, 'INSIDE SERVICE');

    const filtersCollections = {
      ...(type ? { type } : {}),
      ...(userId ? { userId } : {}),
    };

    const posts = await this.postModel
      .find({ ...filtersCollections })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ [`meta.${sortBy}`]: sortDir === 'asc' ? -1 : 1 })
      .exec();

    const total = await this.postModel.countDocuments(filters);

    return {
      posts,
      meta: {
        pagination: {
          total,
          count: posts.length,
          perPage: perPage,
          currentPage: page,
          totalPages: Math.ceil(total / perPage),
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

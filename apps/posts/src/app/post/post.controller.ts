import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { PostService } from './post.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreatePostDto } from '../dtos/create-post.dto';
import { VoteDto } from '../dtos/vote.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createPost(@Body() dto: CreatePostDto, @Req() req) {
    try {
      console.log(req.userId, 'req.userId');
      
      const newPost = await this.postService.createPost({
        ...dto,
        userId: req.userId,
      });

      return { postId: newPost._id };
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @CacheTTL(60 * 1000)
  @CacheKey('MYKEY')
  @UseGuards(AuthGuard)
  @Get('get-all')
  async getAllPosts() {
    try {
      console.log('INSIDE CONTROLLER');

      return await this.postService.getPosts();
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getPost(@Param('id') id: string) {
    try {
      return await this.postService.getPost(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Post(':id/vote')
  async vote(@Param('id') id: string, @Body() voteDto: VoteDto) {
    return this.postService.vote(id, voteDto);
  }
}

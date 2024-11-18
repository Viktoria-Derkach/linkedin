import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreatePostDto, CreatePostResponseDto } from '../dtos/create-post.dto';
import { GetPostPesponseDto } from '../dtos/get-post.dto';
import { VoteDto } from '../dtos/vote.dto';
import { AuthGuard } from '../guards/auth.guard';
import { PostService } from './post.service';

@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Used to create a new post' })
  @ApiCreatedResponse({
    description: 'Post created',
    type: CreatePostResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad payload sent' })
  @UseGuards(AuthGuard)
  @Post('create')
  async createPost(@Body() dto: CreatePostDto, @Req() req) {
    try {
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

  @ApiOkResponse({ type: GetPostPesponseDto, isArray: true })
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

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }

  @Post(':id/vote')
  async vote(@Param('id') id: string, @Body() voteDto: VoteDto) {
    return this.postService.vote(id, voteDto);
  }
}

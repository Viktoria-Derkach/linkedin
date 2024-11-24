import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { CacheTTL } from '@nestjs/cache-manager';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { POST_NOT_FOUND_ERROR } from '../constants/errors.constants';
import { CreatePostDto, CreatePostResponseDto } from '../dtos/create-post.dto';
import { GetPostPesponseDto } from '../dtos/get-post.dto';
import { FindPostsDto } from '../dtos/get-posts.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { VoteDto } from '../dtos/vote.dto';
import { AuthGuard } from '../guards/auth.guard';
import { IdValidationPipe } from '../pipes/ad-validation.pipe';
import { FormatBodyPipe } from '../pipes/format-body.pipe';
import { PostService } from './post.service';

@ApiBearerAuth()
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  @ApiOperation({ summary: 'Used to create a new post' })
  @ApiCreatedResponse({
    description: 'Post created',
    type: CreatePostResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad payload sent' })
  @UseGuards(AuthGuard)
  @Post('create')
  async createPost(@Body(new FormatBodyPipe()) dto: CreatePostDto, @Req() req) {
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

  @ApiOperation({ summary: 'Used to update a post' })
  @ApiCreatedResponse({
    description: 'Post updated',
    type: CreatePostResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad payload sent' })
  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async updatePost(
    @Param('id') id: string,
    @Body(new FormatBodyPipe()) dto: UpdatePostDto
  ) {
    try {
      const newPost = await this.postService.updatePost(dto, id);

      return newPost;
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @ApiOkResponse({ type: GetPostPesponseDto, isArray: true })
  @CacheTTL(60 * 1000)
  @UseGuards(AuthGuard)
  @Get('get-all')
  async getAllPosts(@Query() query: FindPostsDto) {
    try {
      const cacheKey = `getPosts:${JSON.stringify(query)}`;
      const cachedData = await this.cacheManager.get(cacheKey);
      console.log(cacheKey, 'INSIDE CONTROLLER');

      if (cachedData) {
        return cachedData;
      }
      const { page, perPage, sortBy, sortDir, type, userId } = query;

      const posts = await this.postService.getPosts(
        page,
        perPage,
        sortBy,
        sortDir,
        type,
        userId
      );

      await this.cacheManager.set(cacheKey, posts);

      return posts;
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

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    const post = await this.postService.findById(id);
    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND_ERROR);
    }

    return post;
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    const post = await this.postService.deletePost(id);

    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/vote')
  async vote(@Param('id') id: string, @Body() voteDto: VoteDto) {
    return this.postService.vote(id, voteDto);
  }
}

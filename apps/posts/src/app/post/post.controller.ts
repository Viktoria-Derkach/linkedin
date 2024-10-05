import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { PostService } from './post.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreatePostDto } from '../dtos/create-post.dto';

@Controller()
export class PostController {
  constructor(private readonly appService: PostService) {}

  @UseGuards(AuthGuard)
  @Post('create-post')
  async createPost(@Body() dto: CreatePostDto, @Req() req) {
    try {
      console.log(req.userId);

      // this.appService.createPost({ ...dto, userId: req.userId });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
}

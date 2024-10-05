import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

}

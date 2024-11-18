import { ApiProperty } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class GetPostPesponseDto extends CreatePostDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  userId: string;
}

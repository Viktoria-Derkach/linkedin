import {
  IEvent,
  IMedia,
  IMeta,
  IPoll,
  IPost,
  PostType,
} from '@linkedin/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class PostPoll extends Document implements IPoll {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  options: Types.Array<string>;

  @Prop({ type: [Number], default: [] })
  votes: Types.Array<number>;
}

export const PostPollSchema = SchemaFactory.createForClass(PostPoll);

@Schema()
export class PostMedia extends Document implements IMedia {
  @Prop({ required: true })
  image: string;
}

export const PostMediaSchema = SchemaFactory.createForClass(PostMedia);

@Schema()
export class PostEvent extends Document implements IEvent {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  speakers?: Types.Array<string>;
}

export const PostEventSchema = SchemaFactory.createForClass(PostEvent);

@Schema()
export class Meta extends Document implements IMeta {
  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  interactedAt: Date;

  @Prop({ required: true, type: Date })
  updatedAt: Date;
}

export const MetaSchema = SchemaFactory.createForClass(Meta);

@Schema()
export class Post extends Document<string> implements IPost {
  @Prop({ required: true, unique: false })
  userId: string;

  @Prop({
    required: true,
    enum: PostType,
    type: String,
    default: PostType.Text,
  })
  type: PostType;

  @Prop()
  file?: string;

  @Prop()
  description?: string;

  @Prop({ type: PostEventSchema, _id: false })
  event?: PostEvent;

  @Prop({ type: PostMediaSchema, _id: false })
  media?: PostMedia;

  @Prop({ type: PostPollSchema, _id: false })
  poll?: IPoll;

  @Prop({ type: Meta, _id: false })
  meta: IMeta;
}

export const PostSchema = SchemaFactory.createForClass(Post);

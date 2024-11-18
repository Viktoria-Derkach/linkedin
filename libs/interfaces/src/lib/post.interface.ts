export interface IEvent {
  title: string;
  date: Date;
  description?: string;
  speakers?: string[];
}

export interface IMedia {
  image: string; // Image URL or path
}

export interface IMeta {
  createdAt: Date;
  interactedAt: Date;
  updatedAt: Date;
}

export interface IPoll {
  question: string;
  options: string[];
  votes: number[];
}

export enum PostType {
  File = 'file',
  Event = 'event',
  Media = 'media',
  Poll = 'poll',
  Text = 'text',
}

export interface IPost {
  _id: string;
  userId: string;
  type: PostType;

  file?: string;
  description?: string;
  event?: IEvent;
  media?: IMedia;
  poll?: IPoll;
}

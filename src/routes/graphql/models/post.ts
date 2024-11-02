import { IUserExtended } from './user.js';
import { IId } from './common.js';

export interface IPostExtended extends IPostInput, IId {
  author: IUserExtended;
}

export interface IPostInput {
  title: string;
  content: string;
  authorId: string;
}

export type IPost = IPostInput & IId;

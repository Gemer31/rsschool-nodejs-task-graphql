import { IId } from './common.js';

export interface IMemberType extends IId {
  discount: number;
  postsLimitPerMonth: number;
}

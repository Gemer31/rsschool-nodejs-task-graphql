import { IId } from './common.js';
import { IMemberType } from './memberType.js';

export interface IProfileExtended extends IProfileInput, IId {
  memberType: IMemberType;
}

export interface IProfileInput {
  userId: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export type IProfile = IProfileInput & IId;

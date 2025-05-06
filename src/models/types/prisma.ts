import {
  Invitation,
  Scope,
  User,
} from '@prisma/client';

import { ScopeType } from '@/models/index';

export type AvatarStub<T> = Pick<User, 'image' | 'name'> & {
  id: T;
};

export type InvitationResponse = Invitation & { scope: Scope; };


type UserScopes = { scopeType: ScopeType; scopeId: number; joinedDate: Date; }[];

export type UserWithFineCount = User & {
  scopes: UserScopes;
};

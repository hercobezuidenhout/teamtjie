import { UserWithRolesDto } from '@/prisma';
import { UserApiRequest } from './user-api-request';
import { MongoAbility } from '@casl/ability';

export interface AbilitiesApiRequest extends UserApiRequest {
  user: UserWithRolesDto;
  abilities: MongoAbility;
}

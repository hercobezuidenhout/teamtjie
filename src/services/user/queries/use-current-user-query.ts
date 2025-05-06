import { useSession } from '@supabase/auth-helpers-react';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { UserWithRolesDto } from '@/prisma';

export const useCurrentUserQuery = () => {
  const session = useSession();
  return useQuery({
    queryKey: ['users', 'current'],
    queryFn: ({ signal }: QueryFunctionContext) =>
      !!session
        ? get<UserWithRolesDto>(`${ENDPOINTS.user.current}`, {
            signal,
          })
        : Promise.resolve(undefined),
  });
};

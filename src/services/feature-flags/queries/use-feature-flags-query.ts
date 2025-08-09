import { useSession } from '@supabase/auth-helpers-react';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '@/services/endpoints';
import { get } from '@/services/network';
import { FeatureFlag } from '@prisma/client';

export const useFeatureFlagsQuery = () => {
  const session = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: ({ signal }: QueryFunctionContext) => {
      const url = userId
        ? `${ENDPOINTS.featureFlags.base}?userId=${userId}`
        : ENDPOINTS.featureFlags.base;
      return get<FeatureFlag[]>(url, { signal });
    },
  });
};

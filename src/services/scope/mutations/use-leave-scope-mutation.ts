import { QueryClient, useMutation } from '@tanstack/react-query';
import { deleteCallback } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';

export const useLeaveScopeMutation = (scopeId: number) => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: () => deleteCallback(`${ENDPOINTS.scopes.base}/${scopeId}/leave`),
    onSettled: () => {
      queryClient.invalidateQueries();
    }
  });
};

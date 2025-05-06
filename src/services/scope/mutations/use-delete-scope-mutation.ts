import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/services/endpoints';
import { deleteCallback } from '@/services/network';

export const useDeleteScopeMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCallback(`${ENDPOINTS.scopes.base}/${id}`),
    onSettled: () => {
      queryClient.invalidateQueries();
    }
  });
};

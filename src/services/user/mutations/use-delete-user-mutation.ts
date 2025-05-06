import { useMutation } from '@tanstack/react-query';
import { deleteCallback } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: () => deleteCallback(ENDPOINTS.user.base),
  });
};

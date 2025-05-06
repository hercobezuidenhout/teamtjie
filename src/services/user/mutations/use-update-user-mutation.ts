import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildMutationOptions } from '@/services/utilities';
import { UpdateUserDto } from '@/models';
import { put } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    buildMutationOptions(
      (payload: UpdateUserDto) =>
        put<UpdateUserDto>(ENDPOINTS.user.current, payload),
      queryClient,
      [
        [
          {
            queryKey: ['users'],
          },
          undefined,
        ],
      ]
    )
  );
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { CreatePostDto } from '@/models/dtos/feed/create-post-dto';

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostDto) =>
      post<CreatePostDto>(`${ENDPOINTS.feed.base}`, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['feed'],
      });
    },
  });
};

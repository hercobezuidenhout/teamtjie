import { CreateReactionDto } from '@/models';
import { GetFeedDto } from '@/prisma';
import { PaginatedResponse } from '@/models/types/paginated-response';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import produce from 'immer';
import { ENDPOINTS } from '@/services/endpoints';
import { post } from '@/services/network';

interface CreateReactionPayload {
  emoji: string;
  user: { id: string; name: string; };
}

export const useCreateReactionMutation = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ emoji }: CreateReactionPayload) =>
      post<CreateReactionDto>(`${ENDPOINTS.feed.base}/${postId}/reactions`, {
        emoji,
      }),
    onMutate: async ({ emoji, user }: CreateReactionPayload) => {
      const queries = queryClient.getQueriesData<
        InfiniteData<PaginatedResponse<GetFeedDto>>
      >({
        predicate: (query) => query.queryKey[0] === 'feed'
      });

      for (const [queryKey, data] of queries) {
        const newData = produce(data, (draft) => {
          if (!draft) {
            return;
          }

          for (const page of draft.pages) {
            const feedItem = page.data.flat().find((pageItem) => pageItem.id === postId);
            if (feedItem) {
              const affectedEmoji = feedItem.reactions.find(
                (item) => item.emoji === emoji
              );

              if (affectedEmoji) {
                if (
                  affectedEmoji.users.every(
                    (emojiUser) => emojiUser.id !== user.id
                  )
                ) {
                  affectedEmoji.users.push(user);
                }
              } else {
                feedItem.reactions.push({
                  emoji,
                  users: [user],
                  createdAt: new Date(),
                });
              }

              break;
            }
          }
        });

        queryClient.setQueryData(queryKey, newData);
      }
    },
  });
};

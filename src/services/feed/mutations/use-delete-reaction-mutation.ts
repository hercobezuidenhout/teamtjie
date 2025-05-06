import { GetFeedDto } from '@/prisma';
import { PaginatedResponse } from '@/models/types/paginated-response';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import produce from 'immer';
import { ENDPOINTS } from '@/services/endpoints';
import { deleteCallback } from '@/services/network';

interface DeleteReactionPayload {
  emoji: string;
  user: { id: string; name: string; };
}

export const useDeleteReactionMutation = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ emoji }: DeleteReactionPayload) =>
      deleteCallback(`${ENDPOINTS.feed.base}/${postId}/reactions/${emoji}`),
    onMutate: async ({ emoji, user }: DeleteReactionPayload) => {
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
                affectedEmoji.users = affectedEmoji.users.filter(
                  ({ id }) => id !== user.id
                );

                if (affectedEmoji.users.length === 0) {
                  feedItem.reactions = feedItem.reactions.filter(
                    (item) => item.emoji !== emoji
                  );
                }
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

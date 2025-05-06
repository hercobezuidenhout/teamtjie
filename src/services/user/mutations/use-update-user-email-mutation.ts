import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildMutationOptions } from '@/services/utilities';
import { UpdateUserEmailDto } from '@/models/dtos/user/update-user-email-dto';
import { ENDPOINTS } from '@/services/endpoints';
import { put } from '@/services/network';

export const useUpdateUserEmailMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(
        buildMutationOptions(
            (payload: UpdateUserEmailDto) =>
                put<UpdateUserEmailDto>(`${ENDPOINTS.user.base}/email`, payload),
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

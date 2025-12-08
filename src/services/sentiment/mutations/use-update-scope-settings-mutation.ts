import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { put } from '@/services/network';
import { ScopeSettings } from '../types';

interface UpdateScopeSettingsDto {
  scopeId: number;
  showAverageSentiment: boolean;
}

export const useUpdateScopeSettingsMutation = (): UseMutationResult<
  ScopeSettings,
  Error,
  UpdateScopeSettingsDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ scopeId, showAverageSentiment }: UpdateScopeSettingsDto) => {
      return put<{ showAverageSentiment: boolean }, ScopeSettings>(
        `/api/scopes/${scopeId}/settings`,
        { showAverageSentiment }
      );
    },
    onSuccess: (data) => {
      // Invalidate the settings query
      queryClient.invalidateQueries({
        queryKey: ['scopes', data.scopeId, 'settings'],
      });
    },
  });
};

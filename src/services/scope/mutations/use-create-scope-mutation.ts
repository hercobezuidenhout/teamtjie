import { CreateScopeDto } from '@/models';
import { post } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { useMutation } from '@tanstack/react-query';
import { Scope } from '@prisma/client';

export interface CreateScopePayload {
  name: string;
  description: string;
  avatar: Blob | undefined;
  parentScopeId?: number;
  type: 'TEAM' | 'SPACE';
}

export const useCreateScopeMutation = () => {
  const create = (payload: CreateScopePayload) => {
    const data: CreateScopeDto = {
      description: payload.description,
      name: payload.name,
      type: payload.type,
      parentScopeId: payload.parentScopeId,
    };

    return post<Scope>(ENDPOINTS.scopes.base, data);
  };

  return useMutation({
    mutationFn: (team: CreateScopePayload) => create(team),
  });
};

import { CreateInviteDto } from '@/models';
import { post } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { Invitation, RoleType } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useCreateInvitationQuery = (
  scopeId: number,
  defaultRole: RoleType = RoleType.MEMBER
) => {
  return useQuery({
    queryKey: ['invitations', scopeId, defaultRole],
    queryFn: () =>
      post<Invitation, CreateInviteDto>(ENDPOINTS.invitations.base, {
        defaultRole,
        scopeId,
      }),
  });
};

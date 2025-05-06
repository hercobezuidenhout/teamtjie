'use client';

import { useDialog } from '@/contexts/DialogProvider';
import { useRemoveScopeRoleMutation } from '@/services/scope/mutations/use-delete-scope-role-mutation';
import { useUpdateScopeRoleMutation } from '@/services/scope/mutations/use-update-scope-role-mutation';
import { flattenPagination } from '@/utils/flatten-pagination';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { MembersModal } from './MembersModal';
import { UpdateScopeRole } from './update-scope-role';
import { Invitation, RoleType, Scope } from '@prisma/client';
import { useCreateInvitationQuery } from '@/services/invitation/queries/use-create-invitation-query';
import { useScopeQuery } from '@/services/scope/queries/use-scope-query';
import { useUsersInfiniteQuery } from '@/services/user/queries/use-users-infinite-query';
import { GetUserListDto } from '@/prisma/queries/get-users';

interface ScopeMembersProps {
  scope: Scope;
  isOpen: boolean;
  onClose: () => void;
}

export const ScopeMembers = ({ scope, isOpen, onClose }: ScopeMembersProps) => {
  const { data: currentScope } = useScopeQuery(scope.id);
  const [filter, setFilter] = useState<string>();
  const [debouncedFilter] = useDebounce(filter, 200);
  const { notify } = useDialog();
  const toast = useToast();
  const [defaultRole, setDefaultRole] = useState<RoleType>(RoleType.MEMBER);
  const { data: invitation, isLoading: isLoadingInvite } =
    useCreateInvitationQuery(scope.id, defaultRole);
  const { mutateAsync: updateScopeRole } = useUpdateScopeRoleMutation(scope.id, [
    'users',
    scope.type,
    scope.id,
    filter,
  ]);
  const { mutateAsync: removeScopeRole } = useRemoveScopeRoleMutation(scope.id, [
    'users',
    scope.type,
    scope.id,
    filter,
  ]);

  const {
    data: pagination,
    isLoading: isLoadingMembers,
    fetchNextPage,
  } = useUsersInfiniteQuery({
    filter: debouncedFilter,
    scopeId: scope.id,
    scopeType: scope.type
  });

  const { data, count } = flattenPagination(pagination);

  const generateInviteLink = (invitation?: Invitation) =>
    invitation
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/join/${invitation.hash}`
      : '';

  const handleMemberRoleChange = async ({
    userId,
    newRole,
    currentRole,
  }: UpdateScopeRole) => {
    try {
      await updateScopeRole({
        newRole: newRole,
        currentRole: currentRole,
        userId: userId,
      });

      toast({
        duration: 2000,
        position: 'bottom-left',
        description: `Successfully updated role.`,
        status: 'success',
      });
    } catch (error) {
      toast({
        duration: 2000,
        position: 'bottom-left',
        description: `Something went wrong.`,
        status: 'error',
      });
    }
  };

  const removeRole = async (user: GetUserListDto) => {
    try {
      await removeScopeRole({
        role: user.roles[0].role,
        userId: user.id,
      });

      toast({
        duration: 2000,
        position: 'bottom-left',
        description: `Successfully removed user.`,
        status: 'success',
      });
    } catch (error) {
      toast({
        duration: 2000,
        position: 'bottom-left',
        description: `Something went wrong.`,
        status: 'error',
      });
    }
  };

  const handleMemberRemoveClick = (user: GetUserListDto) => {
    notify({
      title: 'Remove User',
      message: `Are you sure you want to remove ${user.name} from the team?`,
      callback: () => removeRole(user),
    });
  };

  const createNewInvite = async (newRole: RoleType) => setDefaultRole(newRole);

  return (
    <MembersModal
      scope={scope}
      scopeId={scope.id}
      scopeName={currentScope?.name}
      isOpen={isOpen}
      onClose={onClose}
      members={data}
      count={count}
      isLoading={isLoadingMembers}
      handleNextPage={fetchNextPage}
      filter={filter}
      setFilter={(newFilter) => setFilter(newFilter)}
      invite={generateInviteLink(invitation)}
      onChangeRole={createNewInvite}
      inviteRole={invitation?.defaultRole || 'MEMBER'}
      onMemberRoleChange={handleMemberRoleChange}
      onMemberRemoveClick={handleMemberRemoveClick}
      isLoadingInvite={isLoadingInvite}
    />
  );
};

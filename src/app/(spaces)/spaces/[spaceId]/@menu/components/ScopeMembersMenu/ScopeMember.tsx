import { Can } from '@/lib/casl/Can';
import { ICONS } from '@/lib/icons/icons';
import { AvatarTag } from '@/lib/tags/AvatarTag/AvatarTag';
import { AvatarStub } from '@/models';
import { subject } from '@casl/ability';
import { Flex, HStack, Icon, IconButton, Link, Select, Tag } from '@chakra-ui/react';
import { RoleType, ScopeRole } from '@prisma/client';
import { ChangeEvent } from 'react';
import { UpdateScopeRole } from './update-scope-role';
import { RoleStar } from '@/lib/tags/AvatarTag/RoleStar';

export interface ScopeMemberProps extends AvatarStub<string> {
  size?: 'sm' | 'md' | 'lg';
  roles: ScopeRole[];
  onMemberClick: () => void;
  onMemberRoleChange: (scopeRole: UpdateScopeRole) => void;
  onMemberRemoveClick: () => void;
  scopeId: number;
}

export const ScopeMember = ({
  name,
  image,
  id,
  size = 'md',
  roles,
  scopeId,
  onMemberClick,
  onMemberRoleChange,
  onMemberRemoveClick,
}: ScopeMemberProps) => {
  const isAdmin = roles?.filter((role) => role.role === 'ADMIN').length > 0;
  const isGuest = roles?.filter((role) => role.role === 'GUEST').length > 0;
  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    onMemberRoleChange({
      userId: id,
      currentRole:
        roles.find((role) => role.userId == id)?.role || ('' as RoleType),
      newRole: event.target?.value as RoleType,
    });
  };

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Link onClick={onMemberClick}>
        <HStack pt={2} pb={4}>
          <AvatarTag avatar={{ id, name, image }} size={size} />
          {isAdmin && <RoleStar />}
          {isGuest && <Tag>GUEST</Tag>}
        </HStack>
      </Link>
      <Can I="manage" this={subject('Scope', { id: scopeId })}>
        <HStack>
          <Select
            onChange={(event) => handleRoleChange(event)}
            cursor="pointer"
            value={roles[0].role}
            variant="unstyled"
            width="fit-content"
            size="sm"
          >
            <option value="GUEST">Guest</option>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </Select>
          <IconButton
            onClick={onMemberRemoveClick}
            variant="ghost"
            color="chakra-active-text"
            aria-label="Remove member"
            icon={<Icon as={ICONS.DeleteIcon} />}
          />
        </HStack>
      </Can>
    </Flex>
  );
};

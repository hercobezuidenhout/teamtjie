import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { RoleType, Scope } from '@prisma/client';
import { Can } from '@/lib/casl/Can';
import { subject } from '@casl/ability';

export interface ModalInviteLinkProps {
  invite: string;
  inviteRole: string;
  onChangeRole: (newRole: RoleType) => Promise<void>;
  isLoadingInvite?: boolean;
  scope: Scope;
}

export const ModalInviteLink = ({
  invite,
  inviteRole,
  onChangeRole,
  isLoadingInvite,
  scope
}: ModalInviteLinkProps) => {
  const toast = useToast();

  const copyInvite = async () => {
    try {
      if (!invite) return;
      await navigator.clipboard.writeText(invite);
      toast({
        status: 'success',
        title: 'The link has been copied!',
      });
    } catch (error) {
      toast({
        status: 'error',
        title: 'Failed to Create an Invitation',
        description:
          "We couldn't create an invitation. Please try again later.",
      });

      console.error(error);
    }
  };

  return (
    <VStack width="full" alignItems="start">
      <HStack justifyContent="space-between" w="full">
        <Text color="chakra-subtle-text">
          Or, send an invite link to your teammate
        </Text>
        <Select
          onChange={(e) => onChangeRole(e.target.value as RoleType)}
          value={inviteRole}
          variant="unstyled"
          width="fit-content"
        >
          {scope.type !== 'SPACE' && (
            <Can I='invite' this={subject('Scope', { id: scope.id, role: 'GUEST' })}>
              <option value="GUEST">Guest</option>
            </Can>
          )}
          <Can I='invite' this={subject('Scope', { id: scope.id, role: 'MEMBER' })}>
            <option value="MEMBER">Member</option>
          </Can>
          <Can I='invite' this={subject('Scope', { id: scope.id, role: 'ADMIN' })}>
            <option value="ADMIN">Admin</option>
          </Can>
        </Select>
      </HStack>
      <InputGroup size="lg">
        <Input pr="4.5rem" type="text" value={invite} fontSize="sm" readOnly />
        <InputRightElement width="fit-content" mr={2}>
          <Button isLoading={!!isLoadingInvite} onClick={copyInvite}>
            Copy
          </Button>
        </InputRightElement>
      </InputGroup>
      <Text color="chakra-subtle-text">Invite links expire after 24 hours</Text>
    </VStack>
  );
};

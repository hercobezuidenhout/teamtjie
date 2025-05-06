import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { MembersSearchBar } from './MembersSearchBar';
import { ModalInviteLink, ModalInviteLinkProps } from './ModalInviteLink';
import { ScopeMember } from './ScopeMember';
import { subject } from '@casl/ability';
import { Can } from '@/lib/casl/Can';
import { GetUserListDto } from '@/prisma/queries/get-users';
import { UpdateScopeRole } from './update-scope-role';
import { InfiniteList } from '@/lib/lists/InfiniteList';

interface MembersModalProps extends ModalInviteLinkProps {
  isOpen: boolean;
  onClose: () => void;
  scopeName?: string;
  scopeId: number;
  members: GetUserListDto[];
  count: number;
  isLoading: boolean;
  handleNextPage: () => void;
  filter?: string;
  setFilter: (filter: string) => void;
  onMemberRoleChange: (scopeRole: UpdateScopeRole) => void;
  onMemberRemoveClick: (user: GetUserListDto) => void;
}

export const MembersModal = ({
  isOpen,
  onClose,
  scopeName,
  scopeId,
  count,
  members,
  isLoading,
  handleNextPage,
  filter,
  setFilter,
  onMemberRoleChange,
  onMemberRemoveClick,
  ...props
}: MembersModalProps) => {
  const size = useBreakpointValue({ base: 'full', md: 'xl' });
  const maxHeight = useBreakpointValue({ base: 'xs', md: 'sm' });
  const padding = useBreakpointValue({ base: 1, md: 2 });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent backgroundColor="chakra-card-bg" p={padding}>
        <ModalHeader>{scopeName} Members</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={0}>
          <VStack width="full" pb={0}>
            <MembersSearchBar filter={filter} setFilter={setFilter} />
            <Box
              maxHeight={maxHeight}
              w="full"
              overflow="scroll"
              css={{
                '&::-webkit-scrollbar-corner': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <InfiniteList
                count={count}
                data={members}
                isLoading={isLoading}
                onNextPage={handleNextPage}
                itemTemplate={(user, _) => (
                  <ScopeMember
                    {...user}
                    onMemberClick={onClose}
                    onMemberRoleChange={onMemberRoleChange}
                    scopeId={scopeId}
                    onMemberRemoveClick={() => onMemberRemoveClick(user)}
                  />
                )}
                skeletonTemplate={() => <Skeleton />}
                showDivider
              />
            </Box>
          </VStack>
        </ModalBody>

        <Can I="invite" this={subject('Scope', { id: scopeId })}>
          <ModalFooter>
            <ModalInviteLink {...props} />
          </ModalFooter>
        </Can>
      </ModalContent>
    </Modal>
  );
};

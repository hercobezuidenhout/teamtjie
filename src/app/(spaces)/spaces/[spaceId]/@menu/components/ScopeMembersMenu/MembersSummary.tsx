import {
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { User } from '@prisma/client';
import { FiUserPlus } from 'react-icons/fi';

interface MembersSummaryProps {
  memberCount?: number;
  members?: User[];
  handleClick: () => void;
  isLoading: boolean;
}

export const MembersSummary = ({
  memberCount,
  members,
  handleClick,
}: MembersSummaryProps) => (
  <Card cursor="pointer" onClick={handleClick}>
    <CardBody display="flex" alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <AvatarGroup size="sm">
          {members
            ?.slice(0, 3)
            .map((member) => (
              <Avatar
                key={member.id}
                name={member.name}
                src={member.image || ''}
              />
            ))}
        </AvatarGroup>
        <Heading size="sm" ml={2}>
          {memberCount} Members
        </Heading>
      </Flex>
      <FiUserPlus />
    </CardBody>
  </Card>
);

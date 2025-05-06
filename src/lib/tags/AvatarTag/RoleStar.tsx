import { ICONS } from '@/lib/icons/icons';
import { Icon } from '@chakra-ui/react';

interface RoleStarProps {
  type?: 'ADMIN' | 'OWNER';
}

export const RoleStar = ({ type = 'ADMIN' }: RoleStarProps) => {
  const color = type === 'OWNER' ? 'yellow.500' : 'gray.400';
  return <Icon as={ICONS.StarIcon} color={color} fill={color} />;
};

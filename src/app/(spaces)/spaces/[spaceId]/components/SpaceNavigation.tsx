'use client';

import { VStack, Button, Icon, useDisclosure } from '@chakra-ui/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ICONS } from '@/lib/icons/icons';
import { useScopes } from '@/contexts/ScopeProvider';
import { ScopeMembers } from '../@menu/components/ScopeMembersMenu/ScopeMembers';
import { useMemo } from 'react';

export const SpaceNavigation = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { current } = useScopes();
  const spaceId = params['spaceId'] as string;

  const currentScope = current.space;

  const isActive = (path: string) => pathname === path;

  const navItems = useMemo(() => [
    {
      label: 'Home',
      icon: ICONS.HomeIcon,
      path: `/spaces/${spaceId}`,
      onClick: () => router.push(`/spaces/${spaceId}`)
    },
    {
      label: 'Charter',
      icon: ICONS.AwardIcon,
      path: `/spaces/${spaceId}/charters/${spaceId}`,
      onClick: () => router.push(`/spaces/${spaceId}/charters/${spaceId}`)
    },
    {
      label: 'Members',
      icon: ICONS.TeamIcon,
      path: null,
      onClick: onOpen
    },
    {
      label: 'Settings',
      icon: ICONS.SettingsIcon,
      path: `/settings/${spaceId}`,
      onClick: () => router.push(`/settings/${spaceId}`)
    }
  ], [spaceId, router, onOpen]);

  if (!currentScope || currentScope.id === 0) {
    return null;
  }

  return (
    <>
      <VStack align="stretch" spacing={2}>
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={item.icon} />}
            onClick={item.onClick}
            backgroundColor={item.path && isActive(item.path) ? 'chakra-primary-color-soft' : undefined}
            _hover={{
              backgroundColor: item.path && isActive(item.path) ? 'chakra-primary-color-soft' : 'chakra-subtle-bg'
            }}
          >
            {item.label}
          </Button>
        ))}
      </VStack>
      <ScopeMembers scope={currentScope} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

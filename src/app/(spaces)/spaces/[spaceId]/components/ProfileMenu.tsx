'use client';

import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/menu';
import { Button, HStack, useBreakpointValue } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { ICONS } from '@/lib/icons/icons';
import { AvatarTag } from '@/lib/tags/AvatarTag/AvatarTag';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCurrentUserQuery } from '@/services/user/queries/use-current-user-query';

export const ProfileMenu = () => {
  const { auth } = useSupabaseClient();
  const { data: currentUser } = useCurrentUserQuery();
  const hideName = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  const handleSignOutClick = () => {
    auth.signOut().then(() => router.push('/'));
  };

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        aria-label="Profile"
        variant="ghost"
        pl={0}
        pr={4}
      >
        <HStack>
          <AvatarTag hideLabel={hideName} avatar={currentUser} size="lg" />
        </HStack>
      </MenuButton>
      <MenuList>
        <Link href={`/me`}>
          <MenuItem icon={<Icon as={ICONS.UserIcon} fontSize="lg" />}>
            View Account
          </MenuItem>
        </Link>
        <MenuDivider />
        <MenuItem
          icon={<Icon as={ICONS.SignOutIcon} fontSize="lg" />}
          onClick={handleSignOutClick}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

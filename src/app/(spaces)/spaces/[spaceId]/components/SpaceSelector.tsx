'use client';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import { AvatarTag } from '@/lib/tags/AvatarTag/AvatarTag';
import { useScopes } from '@/contexts/ScopeProvider';
import { ICONS } from '@/lib/icons/icons';
import { Scope } from '@prisma/client';
import { useRouter } from 'next/navigation';


export interface SpaceSelectorProps {
  spaces: Scope[];
}

export const SpaceSelector = ({ spaces }: SpaceSelectorProps) => {
  const {
    current: { space: activeSpace },
  } = useScopes();
  const router = useRouter();
  const hideLabel = useBreakpointValue<boolean>({ base: true, sm: false });

  const handleSpaceClick = (space: Scope) => {
    router.push(`/spaces/${space.id}`);
  };

  return (
    <Menu>
      <MenuButton
        variant="ghost"
        as={Button}
        w="full"
        textAlign="left"
        pr={2}
        rightIcon={<ChevronDownIcon />}
      >
        {activeSpace ? (
          <AvatarTag
            avatar={activeSpace}
            size="lg"
            ml={-4}
            hideLabel={hideLabel}
          />
        ) : (
          <Text>Select a space</Text>
        )}
      </MenuButton>
      <MenuList>
        {spaces.map((space) => (
          <MenuItem
            onClick={() => handleSpaceClick(space)}
            key={space.id}
          >
            <AvatarTag avatar={space} />
          </MenuItem>
        ))}
        <MenuDivider />
        <MenuItem
          as={Link}
          href={'/spaces/create'}
          variant="unstyled"
          icon={<Icon aria-label="Create Space" as={ICONS.PlusIcon} />}
        >
          New Space
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

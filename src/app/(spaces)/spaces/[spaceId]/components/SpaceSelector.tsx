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
import React, { useMemo } from 'react';
import { AvatarTag } from '@/lib/tags/AvatarTag/AvatarTag';
import { useScopes } from '@/contexts/ScopeProvider';
import { ICONS } from '@/lib/icons/icons';
import { Scope } from '@prisma/client';
import { useRouter } from 'next/navigation';

export const SpaceSelector = () => {
  const {
    current: { space: activeSpace },
    scopes,
  } = useScopes();
  const router = useRouter();
  const hideLabel = useBreakpointValue<boolean>({ base: true, sm: false });

  // Filter for top-level spaces only (no parent scope)
  const topLevelSpaces = useMemo(
    () => scopes?.filter(scope => !scope.parentScopeId) || [],
    [scopes]
  );

  const handleSpaceClick = (space: Scope) => {
    router.push(`/spaces/${space.id}`);
  };

  // Don't render if no active space (e.g., during SSR or outside provider)
  if (!activeSpace || activeSpace.id === 0) {
    return null;
  }

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
        {topLevelSpaces.map((space) => (
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

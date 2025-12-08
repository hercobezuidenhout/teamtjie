import { Divider, HStack, VStack } from '@chakra-ui/react';
import React from 'react';
import { ProfileMenu } from './ProfileMenu';
import { SupportMenu } from './SupportMenu';
import { SpaceSelector } from './SpaceSelector';
import { NavDrawerToggle } from './NavDrawerToggle';

export const SpacesHeader = () => (
  <VStack position="fixed" alignItems="stretch" width="full" gap="3" zIndex="10">
    <HStack width='full' margin="auto" py={{ base: 2, md: 2 }} px={{ base: 2, md: 3 }} justifyContent="space-between" backgroundColor="chakra-body-bg">
      <HStack gap={{ base: 0, md: 2 }}>
        <NavDrawerToggle />
        <SpaceSelector />
      </HStack>

      <HStack gap={{ base: 2, md: 2 }}>
        <HStack>
          <SupportMenu />
        </HStack>
        <Divider orientation="vertical" height={5} />
        <ProfileMenu />
      </HStack>
    </HStack>
  </VStack>
);

'use client';

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useMenu } from '@/contexts/MenuProvider';
import { PropsWithChildren } from 'react';

export const NavDrawer = ({ children }: PropsWithChildren) => {
  const { showButton, isOpen, toggle } = useMenu();
  return showButton ? (
    <Drawer isOpen={isOpen} placement="left" onClose={toggle}>
      <DrawerOverlay />
      <DrawerContent backgroundColor="chakra-body-bg">
        <DrawerHeader>Menu</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody as="nav">
          <Box>{children}</Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ) : (
    <>{children}</>
  );
};

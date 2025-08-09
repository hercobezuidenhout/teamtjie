'use client';

import { Icon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { useMenu } from '@/contexts/MenuProvider';
import { FiMenu } from 'react-icons/fi';

export const NavDrawerToggle = () => {
  const { toggle, showButton } = useMenu();

  return (
    <IconButton
      aria-label="Menu"
      size="md"
      variant="ghost"
      icon={<Icon as={FiMenu} />}
      onClick={toggle}
      display={showButton ? 'block' : 'none'}
    />
  );
};

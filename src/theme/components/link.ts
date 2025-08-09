import { ComponentStyleConfig } from '@chakra-ui/react';

export const Link: ComponentStyleConfig = {
  baseStyle: {
    _activeLink: {
      color: 'chakra-active-text',
    },
  },
  variants: {
    menu: {
      fontWeight: 'semibold',
      w: 'full',
      _activeLink: {
        fontWeight: 'bold',
      },
    },
    unstyled: {
      _hover: {
        textDecoration: 'none',
      },
    },
  },
};

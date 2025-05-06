import { ComponentStyleConfig } from '@chakra-ui/react';

export const Tag: ComponentStyleConfig = {
  variants: {
    ghost: {
      container: {
        px: 0,
        color: 'chakra-subtle-text',
      },
    },
    primary: {
      container: {
        bg: 'primary.500',
        color: 'white',
      },
    },
  },
};

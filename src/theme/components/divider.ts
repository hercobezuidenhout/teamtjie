import { ComponentStyleConfig } from '@chakra-ui/react';

export const Divider: ComponentStyleConfig = {
  variants: {
    gradient: ({ colorMode }) =>
      colorMode === 'dark'
        ? {
            bgGradient: `radial-gradient(chakra-border-color, chakra-body-bg)`,
            border: 0,
            height: '1px',
          }
        : {
            borderStyle: 'solid',
          },
  },
};

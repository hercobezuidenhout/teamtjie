import { ComponentStyleConfig } from '@chakra-ui/react';

export const Card: ComponentStyleConfig = {
  baseStyle: {
    container: {
      backgroundColor: 'chakra-card-bg',
    },
  },
  variants: {
    outline: ({ colorMode }) => ({
      container: {
        '--card-border-width': '1px',
        '--card-border-color':
          colorMode === 'dark' ? 'transparent' : 'colors.chakra-border-color',
      },
    }),
  },
  defaultProps: {
    variant: 'outline',
  },
};

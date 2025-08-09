import { ComponentStyleConfig } from '@chakra-ui/react';

export const Badge: ComponentStyleConfig = {
  baseStyle: ({ colorMode, colorScheme }) => ({
    bg: colorMode === 'dark' ? `${colorScheme}.700` : `${colorScheme}.50`,
    color: colorMode === 'dark' ? 'white' : 'black',
  }),
  defaultProps: {
    variant: 'solid',
  },
  variants: {
    solid: {
      borderRadius: '3xl',
      px: 2,
    },
  },
};

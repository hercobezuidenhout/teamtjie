import { ComponentStyleConfig } from '@chakra-ui/react';

export const Input: ComponentStyleConfig = {
  defaultProps: {
    focusBorderColor: 'blue.400',
  },
  sizes: {
    sm: {
      field: {
        '--input-border-radius': 'radii.md',
      },
      group: {
        '--input-border-radius': 'radii.md',
      },
    },
  },
};

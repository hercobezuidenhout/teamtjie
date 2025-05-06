import { ComponentStyleConfig } from '@chakra-ui/react';

export const Modal: ComponentStyleConfig = {
  defaultProps: { size: 'xl', isCentered: true },
  baseStyle: {
    body: {
      px: 8,
      pb: 8,
      minH: '2xs',
      display: 'flex',
      justifyContent: 'stretch',
      justifyItems: 'stretch',
    },
  },
};

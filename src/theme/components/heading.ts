import { ComponentStyleConfig } from '@chakra-ui/react';

export const Heading: ComponentStyleConfig = {
  baseStyle: { fontWeight: '200' },
  defaultProps: { size: 'md' },
  variants: {
    title: {
      fontWeight: 600,
      fontVariant: 'small-caps',
    },
    subheading: {
      fontSize: 'lg',
    },
    'modal-subheading': {
      fontSize: 'lg',
      color: 'gray.500',
    },
    'menu-heading': {
      color: 'chakra-subtle-text',
      fontSize: 'sm',
    },
  },
};

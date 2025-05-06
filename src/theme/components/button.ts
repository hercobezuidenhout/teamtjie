import { ComponentStyleConfig } from '@chakra-ui/react';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const variantSecondary: SystemStyleFunction = (props) => {
  const bg = mode(`gray.50`, `whiteAlpha.200`)(props);
  return {
    bg,
    _hover: {
      bg: mode(`gray.200`, `whiteAlpha.300`)(props),
      _disabled: {
        bg,
      },
    },
    _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) },
  };
};

export const Button: ComponentStyleConfig = {
  baseStyle: { borderRadius: '3xl' },
  defaultProps: { variant: 'secondary' },
  sizes: {
    md: { h: '9', minW: '9' },
    sm: { p: 1 },
  },
  variants: {
    primary: {
      bg: 'chakra-primary-color',
      color: 'white',
      _hover: {
        bg: 'chakra-primary-color',
        _disabled: {
          bg: 'chakra-primary-color',
        },
      },
      _active: { bg: 'primary.400' },
    },
    secondary: variantSecondary,
    outline: {
      borderColor: 'inherit',
    },
    ghost: {
      color: 'inherit',
      _hover: {
        bg: 'gray.50'
      },
    },
  },
};

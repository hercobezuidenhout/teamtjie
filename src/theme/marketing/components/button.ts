import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const xl = defineStyle({
  minW: 16,
  fontSize: { base: 'lg', md: '2xl' },
  px: { base: 8, md: 16 },
  py: 3,
});

const primary = defineStyle({
  bg: 'chakra-primary-color-soft',
  color: 'chakra-primary-color'
});

const ghost = defineStyle(({ colorScheme }) => ({
  color: 'chakra-body-text',
  _hover: {
    bg: 'transparent',
    color: `${colorScheme}.300`,
  },
}));

const secondary = defineStyle({
  bgGradient: 'linear(to-b, transparent, gray.800)',
  border: '1px solid',
  borderColor: 'gray.800',
  color: 'chakra-body-text',
  _hover: {
    bgGradient: 'linear(to-b, transparent, gray.700)',
  },
});

export const buttonTheme = defineStyleConfig({
  baseStyle: {
    borderRadius: 'full',
    fontWeight: 'bold',
  },
  defaultProps: { variant: 'primary' },
  sizes: { xl },
  variants: { ghost, primary, secondary },
});

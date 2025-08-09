import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const unstyled = defineStyle({
  _hover: { textDecoration: 'none' },
});

const highlight = defineStyle(({ colorScheme }) => ({
  _hover: { textDecoration: 'none', color: `${colorScheme}.300` },
}));

export const linkTheme = defineStyleConfig({
  defaultProps: { colorScheme: 'primary' },
  variants: { highlight, unstyled },
});

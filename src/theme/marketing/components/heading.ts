import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const highlight = defineStyle({
  bgGradient: 'linear(to-b, chakra-body-text, red.300)',
  backgroundClip: 'text',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  lineHeight: 'unset',
});

export const headingTheme = defineStyleConfig({
  defaultProps: {
    size: 'lg',
  },
  variants: {
    highlight: highlight,
  },
});

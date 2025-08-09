import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    bg: 'chakra-primary-color-soft',
    h: 'full',
    backgroundClip: 'padding-box',
    borderRadius: '2xl',
    p: 6,
    justifyContent: 'center',
    ':before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: -1,
      margin: '-1px',
      borderRadius: 'inherit'
    },
  },
  header: { p: 2 },
  body: { p: 2 },
  footer: { p: 2 },
});

const highlight = definePartsStyle({
  container: {
    ':before': {
      boxShadow: 'rgba(186, 28, 14, 0.20) 0 0 90px 33px',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: -1000,
      margin: '-1px',
      borderRadius: 'inherit',
      bgGradient: 'linear(to-b, red.500, transparent)',
    },
  },
});

export const cardTheme = defineMultiStyleConfig({
  baseStyle,
  variants: { highlight },
});

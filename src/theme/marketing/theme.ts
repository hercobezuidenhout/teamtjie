'use client';

import { extendTheme } from '@chakra-ui/react';
import { global } from '@/theme/styles/global';
import { cardTheme } from './components/card';
import { headingTheme } from './components/heading';
import { buttonTheme } from './components/button';
import { inputTheme } from './components/input';
import { linkTheme } from './components/link';
import { accordionTheme } from './components/accordion';
import { colors } from '@/theme/colors';
import { semanticTokens } from '@/theme/semanticTokens';

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
  },
  useSystemColorMode: false,
  colors,
  components: {
    Accordion: accordionTheme,
    Card: cardTheme,
    Heading: headingTheme,
    Button: buttonTheme,
    Link: linkTheme,
    Input: inputTheme,
    Textarea: inputTheme,
  },
  fonts: {
    heading: 'var(--font-dm-sans)',
    body: 'var(--font-dm-sans)',
  },
  semanticTokens: { colors: { ...semanticTokens.colors, 'chakra-body-bg': '#12131B', } },
  shadows: {
    outline: '0 0 0 3px rgba(196, 3, 26, 0.5)',
  },
  sizes: {
    header: '5rem',
    container: { xl: '1540px' },
    footer: '0rem',
  },
  styles: {
    global: {
      body: {
        overflowX: 'hidden',
        background: 'white'
      },
      ...global,
    },
  },
});

import { extendTheme } from '@chakra-ui/react';
import { global } from '@/theme/styles/global';
import { fonts } from '@/theme/fonts';
import { semanticTokens } from '@/theme/semanticTokens';
import * as components from '@/theme/components';
import { colors } from '@/theme/colors';

export const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
  colors,
  fonts,
  components: { ...components },
  semanticTokens,
  shadows: {
    outline: '0 0 0 3px rgba(196, 3, 26, 0.5)',
  },
  sizes: {
    header: '5rem',
    container: { xl: '1540px' },
    footer: '0rem',
  },
  styles: {
    global,
  },
});

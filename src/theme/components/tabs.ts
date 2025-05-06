import { ComponentStyleConfig, PartsStyleFunction } from '@chakra-ui/react';
import { tabsAnatomy as parts } from '@chakra-ui/anatomy';
import { mode } from '@chakra-ui/theme-tools';

const variantLine: PartsStyleFunction<typeof parts> = (props) => {
  const { colorScheme, orientation } = props;
  const isVertical = orientation === 'vertical';
  const borderProp =
    orientation === 'vertical' ? 'borderStart' : 'borderBottom';
  const marginProp = isVertical ? 'marginStart' : 'marginBottom';

  return {
    tablist: {
      [borderProp]: '2px solid',
      borderColor: mode('gray.100', 'gray.800')(props),
    },
    tab: {
      [borderProp]: '2px solid',
      borderColor: 'transparent',
      [marginProp]: '-2px',
      _selected: {
        color: 'chakra-body-text',
        borderColor: `${colorScheme}.500`,
      },
      _active: {
        bg: 'chakra-border-color',
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
  };
};

export const Tabs: ComponentStyleConfig = {
  defaultProps: {
    isFitted: true,
    colorScheme: 'primary',
    size: 'md',
  },
  baseStyle: {
    tab: {
      fontWeight: 'bold',
    },
    tabpanel: {
      px: 0,
    },
  },
  variants: {
    line: variantLine,
  },
};

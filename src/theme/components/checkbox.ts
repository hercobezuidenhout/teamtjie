import { ComponentStyleConfig } from '@chakra-ui/react';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const baseStyleControl: SystemStyleFunction = (props) => {
  const { colorScheme: c } = props;

  return {
    control: {
      transitionProperty: 'box-shadow',
      transitionDuration: 'normal',
      border: '2px solid',
      borderRadius: 'sm',
      borderColor: 'inherit',
      color: 'white',

      _checked: {
        bg: `${c}.500`,
        borderColor: `${c}.500`,
        color: 'white',

        _hover: {
          bg: mode(`${c}.600`, `${c}.300`)(props),
          borderColor: mode(`${c}.600`, `${c}.300`)(props),
        },

        _disabled: {
          borderColor: mode('gray.200', 'transparent')(props),
          bg: mode('gray.200', 'whiteAlpha.300')(props),
          color: mode('gray.500', 'whiteAlpha.500')(props),
        },
      },

      _indeterminate: {
        bg: mode(`${c}.500`, `${c}.200`)(props),
        borderColor: mode(`${c}.500`, `${c}.200`)(props),
        color: mode('white', 'gray.900')(props),
      },

      _disabled: {
        bg: mode('gray.100', 'whiteAlpha.100')(props),
        borderColor: mode('gray.100', 'transparent')(props),
      },

      _focus: {
        boxShadow: 'outline',
      },

      _invalid: {
        borderColor: mode('red.500', 'red.300')(props),
      },
    },
    icon: {
      transitionProperty: 'transform',
      transitionDuration: 'normal',
    },
    label: {
      userSelect: 'none',
      _disabled: { opacity: 0.4 },
    },
  };
};

export const Checkbox: ComponentStyleConfig = {
  defaultProps: {
    variant: 'primary',
    colorScheme: 'primary',
  },
  variants: {
    primary: baseStyleControl,
  },
};

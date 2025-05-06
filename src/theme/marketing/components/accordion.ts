import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    borderTopWidth: '0px',
    _last: {
      borderBottomWidth: '0px',
    },
  },
});

export const accordionTheme = defineMultiStyleConfig({ baseStyle });

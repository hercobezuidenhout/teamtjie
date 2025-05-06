import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(['avatar', 'container', 'label']);

export const AvatarTag = helpers.defineMultiStyleConfig({
  baseStyle: {
    container: {
      overflow: 'clip',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  sizes: {
    sm: {
      avatar: {
        size: '2xs',
      },
      container: {
        maxW: 32,
      },
      label: {
        fontSize: 'sm',
      },
    },
    md: {
      avatar: {
        size: 'xs',
      },
      container: {
        maxW: '3xs',
      },
      label: {
        fontSize: 'md',
      },
    },
    lg: {
      avatar: {
        size: 'sm',
      },
      container: {
        maxW: '2xs',
      },
      label: {
        fontSize: 'lg',
      },
    },
    xl: {
      avatar: {
        size: 'md',
      },
      container: {
        maxW: 'xs',
      },
      label: {
        fontSize: 'lg',
      },
    },
  },
  variants: {},
  defaultProps: {
    size: 'md',
  },
});

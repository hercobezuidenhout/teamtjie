import { ComponentStyleConfig } from '@chakra-ui/react';

export const Alert: ComponentStyleConfig = {
  variants: {
    error: {
      container: {
        bg: "#C4031A1A",
        border: "1px solid #C4031A",
        borderRadius: 8
      },
    },
    success: {
      container: {
        bg: "#6a8e7e",
        border: "1px solid #6a8e7e",
        borderRadius: 8
      },
    },
  },
};
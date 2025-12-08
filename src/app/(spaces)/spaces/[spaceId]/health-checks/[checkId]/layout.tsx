'use client';

import { PropsWithChildren, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

/**
 * Full-screen layout for health check completion
 * Uses CSS to hide parent layout sidebars
 */
export default function HealthCheckLayout({ children }: PropsWithChildren) {
  useEffect(() => {
    // Hide sidebars by targeting parent layout elements
    const style = document.createElement('style');
    style.id = 'health-check-fullscreen';
    style.innerHTML = `
      body {
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleEl = document.getElementById('health-check-fullscreen');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, []);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="chakra-body-bg"
      overflowY="auto"
      zIndex={9999}
    >
      <Box
        as="main"
        width="full"
        maxW="3xl"
        marginInline="auto"
        p={{ base: 4, md: 8 }}
        minH="100vh"
      >
        {children}
      </Box>
    </Box>
  );
}

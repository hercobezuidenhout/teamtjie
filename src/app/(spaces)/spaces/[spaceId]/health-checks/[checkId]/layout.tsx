import { PropsWithChildren } from 'react';
import { Box, VStack } from '@chakra-ui/react';

/**
 * Full-screen layout for health check completion
 * Removes sidebars and navigation for distraction-free experience
 */
export default function HealthCheckLayout({ children }: PropsWithChildren) {
  return (
    <VStack minH="100vh" gap={0} backgroundColor="chakra-body-bg">
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
    </VStack>
  );
}

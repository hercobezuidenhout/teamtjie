'use client';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useHealthChecksQuery } from '@/services/health-check/queries/use-health-checks-query';

export const HealthCheckBanner = () => {
  const params = useParams();
  const router = useRouter();
  const scopeId = parseInt(params['spaceId'] as string, 10);

  const { data: healthChecks } = useHealthChecksQuery({ scopeId });

  if (!healthChecks || !Array.isArray(healthChecks)) {
    return null;
  }

  const incompleteChecks = healthChecks.filter(
    (check) => check.responses.length === 0 || !check.responses[0].completedAt
  );

  if (incompleteChecks.length === 0) {
    return null;
  }

  const handleClick = () => {
    if (incompleteChecks.length === 1) {
      // Go directly to the check
      router.push(`/spaces/${scopeId}/health-checks/${incompleteChecks[0].id}`);
    } else {
      // Go to list
      router.push(`/spaces/${scopeId}/health-checks`);
    }
  };

  return (
    <Alert
      status="info"
      variant="subtle"
      borderRadius="md"
      cursor="pointer"
      onClick={handleClick}
    >
      <AlertIcon />
      <HStack flex="1" justify="space-between" align="center">
        <div>
          <AlertTitle>Health Check Available</AlertTitle>
          <AlertDescription>
            You have {incompleteChecks.length} health {incompleteChecks.length === 1 ? 'check' : 'checks'} to complete
          </AlertDescription>
        </div>
        <Button colorScheme="blue">
          Complete
        </Button>
      </HStack>
    </Alert>
  );
};

'use client';

import {
  VStack,
  Heading,
  Card,
  CardBody,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useHealthChecksQuery } from '@/services/health-check/queries/use-health-checks-query';
import { useCreateHealthCheckMutation } from '@/services/health-check/mutations/use-create-health-check-mutation';
import { useSubscriptionQuery } from '@/services/subscription/queries/use-subscription-query';
import { PremiumFeatureGate } from '@/lib/components/PremiumFeatureGate/PremiumFeatureGate';
import { Can } from '@/lib/casl/Can';
import { subject } from '@casl/ability';
import { ICONS } from '@/lib/icons/icons';
import { format } from 'date-fns';

export default function HealthChecksPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const scopeId = parseInt(params['spaceId'] as string, 10);

  // Call all hooks at the top
  const { data: subscriptionData, isLoading: subscriptionLoading } = useSubscriptionQuery(scopeId);
  const { data: healthChecks, isLoading } = useHealthChecksQuery({ scopeId });
  const createMutation = useCreateHealthCheckMutation();

  // Show premium gate if no subscription
  if (!subscriptionLoading && !subscriptionData?.hasSubscription) {
    return <PremiumFeatureGate scopeId={scopeId} featureName="Health Checks" />;
  }

  const handleCreateHealthCheck = async () => {
    try {
      const result = await createMutation.mutateAsync({ scopeId });

      toast({
        title: 'Health check created',
        status: 'success',
        duration: 2000,
      });

      if (result) {
        router.push(`/spaces/${scopeId}/health-checks/${result.id}`);
      }
    } catch (error) {
      toast({
        title: 'Error creating health check',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleCompleteCheck = (checkId: number) => {
    router.push(`/spaces/${scopeId}/health-checks/${checkId}`);
  };

  if (isLoading) {
    return (
      <VStack width={['full', 'md', '2xl']} m="auto" spacing={5}>
        <Text>Loading health checks...</Text>
      </VStack>
    );
  }

  // Ensure we have a valid array
  const validHealthChecks = Array.isArray(healthChecks) ? healthChecks : [];

  const incompleteChecks = validHealthChecks.filter(
    (check) => check.responses?.length === 0 || !check.responses?.[0]?.completedAt
  );

  const completedChecks = validHealthChecks.filter(
    (check) => check.responses?.length > 0 && check.responses[0]?.completedAt
  );

  return (
    <VStack width={['full', 'md', '2xl']} m="auto" spacing={5}>
      <HStack width="full" justify="space-between">
        <Heading size="lg">Health Checks</Heading>
        <Can I="edit" this={subject('Scope', { id: scopeId })}>
          <Button
            colorScheme="blue"
            leftIcon={<Icon as={ICONS.PlusIcon} />}
            onClick={handleCreateHealthCheck}
            isLoading={createMutation.isPending}
          >
            Create Health Check
          </Button>
        </Can>
      </HStack>

      {incompleteChecks.length > 0 && (
        <VStack align="stretch" width="full" spacing={3}>
          <Heading size="md">Pending</Heading>
          {incompleteChecks.map((check) => (
            <Card
              key={check.id}
              cursor="pointer"
              onClick={() => handleCompleteCheck(check.id)}
              _hover={{ backgroundColor: 'chakra-subtle-bg' }}
            >
              <CardBody>
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Text fontWeight="bold">Team Health Check</Text>
                      <Badge colorScheme="orange">Pending</Badge>
                    </HStack>
                    <Text fontSize="sm" color="chakra-subtle-text">
                      {check.questions.length} questions • Created {format(new Date(check.createdAt), 'MMM d, yyyy')}
                    </Text>
                  </VStack>
                  <Icon as={ICONS.ArrowRightIcon} />
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}

      {completedChecks.length > 0 && (
        <VStack align="stretch" width="full" spacing={3}>
          <Heading size="md">Completed</Heading>
          {completedChecks.map((check) => (
            <Card key={check.id}>
              <CardBody>
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Text fontWeight="bold">Team Health Check</Text>
                      <Badge colorScheme="green">Completed</Badge>
                    </HStack>
                    <Text fontSize="sm" color="chakra-subtle-text">
                      Completed {format(new Date(check.responses[0].completedAt!), 'MMM d, yyyy')}
                    </Text>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}

      {validHealthChecks.length === 0 && (
        <Card>
          <CardBody>
            <VStack py={8}>
              <Text color="chakra-subtle-text">No health checks yet</Text>
              <Can I="edit" this={subject('Scope', { id: scopeId })}>
                <Text fontSize="sm" color="chakra-subtle-text">
                  Create one to get started
                </Text>
              </Can>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
}

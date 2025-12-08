'use client';

import {
  VStack,
  HStack,
  Text,
  Progress,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import { useHealthCheckInsightsQuery } from '@/services/insights/queries/use-health-check-insights-query';
import { format } from 'date-fns';

interface HealthCheckSummaryProps {
  scopeId: number;
}

export const HealthCheckSummary = ({ scopeId }: HealthCheckSummaryProps) => {
  const { data, isLoading } = useHealthCheckInsightsQuery({ scopeId });

  if (isLoading) {
    return <Text color="chakra-subtle-text">Loading health check data...</Text>;
  }

  if (!data || !data.questions) {
    return (
      <VStack py={8}>
        <Text color="chakra-subtle-text">No health check data available</Text>
        <Text fontSize="sm" color="chakra-subtle-text">
          Create and complete a health check to see insights
        </Text>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <Text fontSize="sm" color="chakra-subtle-text">
          {data.totalResponses} {data.totalResponses === 1 ? 'response' : 'responses'} • {format(new Date(data.createdAt), 'MMM d, yyyy')}
        </Text>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {data.questions.map((question) => {
          const percentage = question.average ? (question.average / 5) * 100 : 0;
          const colorScheme =
            question.average && question.average >= 4 ? 'green' :
            question.average && question.average >= 3 ? 'blue' :
            question.average && question.average >= 2 ? 'yellow' : 'red';

          return (
            <Box key={question.title} p={4} borderRadius="md" backgroundColor="chakra-subtle-bg">
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text fontWeight="bold" fontSize="sm">
                    {question.title}
                  </Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {question.average ? question.average.toFixed(1) : 'N/A'}
                  </Text>
                </HStack>
                <Progress
                  value={percentage}
                  colorScheme={colorScheme}
                  borderRadius="full"
                  size="sm"
                />
                <Text fontSize="xs" color="chakra-subtle-text">
                  {question.responseCount} {question.responseCount === 1 ? 'response' : 'responses'}
                </Text>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};

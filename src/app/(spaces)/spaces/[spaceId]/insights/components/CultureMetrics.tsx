'use client';

import { Box, Text, VStack, SimpleGrid } from '@chakra-ui/react';
import { useCultureInsightsQuery } from '@/services/insights/queries/use-culture-insights-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CultureMetricsProps {
  scopeId: number;
  from: string;
  to: string;
}

const COLORS = [
  'var(--chakra-colors-blue-500)',
  'var(--chakra-colors-green-500)',
  'var(--chakra-colors-purple-500)',
  'var(--chakra-colors-orange-500)',
  'var(--chakra-colors-pink-500)',
  'var(--chakra-colors-teal-500)',
];

export const CultureMetrics = ({ scopeId, from, to }: CultureMetricsProps) => {
  const { data, isLoading } = useCultureInsightsQuery({ scopeId, from, to });

  if (isLoading) {
    return <Text color="chakra-subtle-text">Loading culture data...</Text>;
  }

  if (!data || data.totalPosts === 0) {
    return (
      <VStack py={8}>
        <Text color="chakra-subtle-text">No posts available for this period</Text>
      </VStack>
    );
  }

  const hasValues = data.valueDistribution && data.valueDistribution.length > 0;

  return (
    <VStack align="stretch" spacing={6}>
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
        <Box p={4} borderRadius="md" backgroundColor="chakra-subtle-bg">
          <VStack spacing={1}>
            <Text fontSize="2xl" fontWeight="bold">
              {data.totalPosts}
            </Text>
            <Text fontSize="sm" color="chakra-subtle-text">
              Total Wins
            </Text>
          </VStack>
        </Box>
        <Box p={4} borderRadius="md" backgroundColor="chakra-subtle-bg">
          <VStack spacing={1}>
            <Text fontSize="2xl" fontWeight="bold">
              {data.valueDistribution.length}
            </Text>
            <Text fontSize="sm" color="chakra-subtle-text">
              Values Celebrated
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Value Distribution */}
      {hasValues && (
        <VStack align="stretch" spacing={3}>
          <Text fontWeight="bold">Most Celebrated Values</Text>
          <Box height="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.valueDistribution.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-chakra-border-color)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--chakra-colors-chakra-body-text)"
                  tick={{ fill: 'var(--chakra-colors-chakra-body-text)', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="var(--chakra-colors-chakra-body-text)"
                  tick={{ fill: 'var(--chakra-colors-chakra-body-text)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
                    borderColor: 'var(--chakra-colors-chakra-border-color)',
                    color: 'var(--chakra-colors-chakra-body-text)',
                  }}
                  formatter={(value: number) => [`${value} wins`, 'Count']}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {data.valueDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      )}
    </VStack>
  );
};

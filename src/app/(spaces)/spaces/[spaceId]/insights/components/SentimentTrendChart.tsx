'use client';

import { Box, Text, VStack } from '@chakra-ui/react';
import { useSentimentInsightsQuery } from '@/services/insights/queries/use-sentiment-insights-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface SentimentTrendChartProps {
  scopeId: number;
  from: string;
  to: string;
}

export const SentimentTrendChart = ({ scopeId, from, to }: SentimentTrendChartProps) => {
  const { data, isLoading } = useSentimentInsightsQuery({ scopeId, from, to });

  if (isLoading) {
    return <Text color="chakra-subtle-text">Loading sentiment data...</Text>;
  }

  if (!data || data.length === 0) {
    return (
      <VStack py={8}>
        <Text color="chakra-subtle-text">No sentiment data available for this period</Text>
      </VStack>
    );
  }

  if (data.length < 3) {
    return (
      <VStack py={8}>
        <Text color="chakra-subtle-text">Not enough data to show trend</Text>
        <Text fontSize="sm" color="chakra-subtle-text">
          At least 3 days of data needed ({data.length} {data.length === 1 ? 'day' : 'days'} recorded)
        </Text>
      </VStack>
    );
  }

  const chartData = data.map((item) => ({
    date: format(new Date(item.date), 'MMM d'),
    sentiment: item.average,
    count: item.count,
  }));

  return (
    <Box width="full" height="300px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-chakra-border-color)" />
          <XAxis
            dataKey="date"
            stroke="var(--chakra-colors-chakra-body-text)"
            tick={{ fill: 'var(--chakra-colors-chakra-body-text)' }}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke="var(--chakra-colors-chakra-body-text)"
            tick={{ fill: 'var(--chakra-colors-chakra-body-text)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
              borderColor: 'var(--chakra-colors-chakra-border-color)',
              color: 'var(--chakra-colors-chakra-body-text)',
            }}
            formatter={(value: number, _: string, props: any) => {
              const count = props.payload.count;
              return [`${value.toFixed(1)} (${count} ${count === 1 ? 'response' : 'responses'})`, 'Average Sentiment'];
            }}
          />
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="var(--chakra-colors-blue-500)"
            strokeWidth={2}
            dot={{ fill: 'var(--chakra-colors-blue-500)', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

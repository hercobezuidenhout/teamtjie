'use client';

import {
  VStack,
  Heading,
  HStack,
  Select,
  Text,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Can } from '@/lib/casl/Can';
import { subject } from '@casl/ability';
import { SentimentTrendChart } from './components/SentimentTrendChart';
import { HealthCheckSummary } from './components/HealthCheckSummary';
import { CultureMetrics } from './components/CultureMetrics';
import { subDays, format } from 'date-fns';

export default function InsightsPage() {
  const params = useParams();
  const scopeId = parseInt(params['spaceId'] as string, 10);
  const [dateRange, setDateRange] = useState('30');

  const { from, to } = useMemo(() => {
    const toDate = new Date();
    const fromDate = subDays(toDate, parseInt(dateRange));
    return {
      from: format(fromDate, 'yyyy-MM-dd'),
      to: format(toDate, 'yyyy-MM-dd'),
    };
  }, [dateRange]);

  return (
    <VStack width={['full', 'full', 'full']} m="auto" spacing={6} align="stretch">
      <Can
        I="edit"
        this={subject('Scope', { id: scopeId })}
        not={true}
      >
        <Card>
          <CardBody>
            <VStack py={8}>
              <Text fontSize="lg" fontWeight="bold">Access Restricted</Text>
              <Text color="chakra-subtle-text">
                Only team admins can view insights
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Can>

      <Can
        I="edit"
        this={subject('Scope', { id: scopeId })}
      >
        <HStack justify="space-between" align="center">
          <Heading size="lg">Team Insights</Heading>
          <HStack>
            <Text fontSize="sm" color="chakra-subtle-text">
              Date Range:
            </Text>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              size="sm"
              width="auto"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </Select>
          </HStack>
        </HStack>

        {/* Sentiment Trend */}
        <Card>
          <CardHeader>
            <Heading size="md">Sentiment Trend</Heading>
          </CardHeader>
          <CardBody>
            <SentimentTrendChart scopeId={scopeId} from={from} to={to} />
          </CardBody>
        </Card>

        {/* Health Check Results */}
        <Card>
          <CardHeader>
            <Heading size="md">Latest Health Check</Heading>
          </CardHeader>
          <CardBody>
            <HealthCheckSummary scopeId={scopeId} />
          </CardBody>
        </Card>

        {/* Culture Metrics */}
        <Card>
          <CardHeader>
            <Heading size="md">Culture & Values</Heading>
          </CardHeader>
          <CardBody>
            <CultureMetrics scopeId={scopeId} from={from} to={to} />
          </CardBody>
        </Card>
      </Can>
    </VStack>
  );
}

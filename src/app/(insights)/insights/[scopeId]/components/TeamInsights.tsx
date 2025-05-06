'use client';

import { Card, CardBody, Heading, VStack, Text } from "@chakra-ui/react";
import { PostsChart } from "./PostsChart";
import { useAppUsageInsightsQuery } from "@/services/insights/queries/use-app-usage-insights-query";

interface TeamInsightsProps {
    scopeId: number;
}

export const TeamInsights = ({ scopeId }: TeamInsightsProps) => {
    const { data, isLoading } = useAppUsageInsightsQuery(scopeId);
    console.info('useAppUsageInsightsQuery', data);

    return (
        <VStack align="stretch">
            <PostsChart isLoading={isLoading} data={data} />
            <Card>
                <CardBody>
                    <VStack>
                        <Heading size="xl">🙌</Heading>
                        <Heading>Watch This Space</Heading>
                        <Text>Some exciting stuff is coming!</Text>
                    </VStack>
                </CardBody>
            </Card>
        </VStack>
    );
};
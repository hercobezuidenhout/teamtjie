'use client';

import { PostChartData } from "@/models/types/post-chart-data";
import { Card, CardBody, CardHeader, Heading, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PostChartProps {
    data?: PostChartData[];
    isLoading?: boolean;
}

export const PostsChart = ({ data, isLoading }: PostChartProps) => {
    const CHART_HEIGHT = 200;

    return (
        <Card>
            <CardHeader>
                <HStack>
                    <VStack align="stretch">
                        <Heading>Post Usage</Heading>
                        <Text color="chakra-subtle-text">In the past week</Text>
                    </VStack>
                </HStack>
            </CardHeader>
            <CardBody>
                {isLoading && !data && (
                    <Spinner />
                )}
                {!isLoading && data && (
                    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                        <LineChart data={data}
                            margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="fines" stroke="#1570ef" />
                            <Line type="monotone" dataKey="wins" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="payments" stroke="#ca8382" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardBody>
        </Card>
    );
};
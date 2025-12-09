'use client';

import { Box, Container, Heading, Text, VStack, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { useScopeSubscriptionQuery } from '@/services/billing/queries/use-scope-subscription-query';
import { UpgradeCard } from './components/UpgradeCard';

interface BillingPageProps {
    params: { scopeId: string; };
}

export default function BillingPage({ params }: BillingPageProps) {
    const { scopeId } = params;
    const numericScopeId = parseInt(scopeId, 10);

    const { data: subscription, isLoading, error } = useScopeSubscriptionQuery(numericScopeId);

    if (isLoading) {
        return (
            <Container maxW="container.lg" py={8}>
                <VStack spacing={4}>
                    <Spinner size="xl" color="chakra-primary-color" />
                    <Text color="chakra-subtle-text">Loading billing information...</Text>
                </VStack>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="container.lg" py={8}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <AlertTitle>Error loading billing information</AlertTitle>
                    <AlertDescription>
                        Please try again later or contact support if the problem persists.
                    </AlertDescription>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxW="container.lg" py={8}>
            <VStack spacing={8} align="stretch">
                {/* Header */}
                <Box>
                    <Heading size="lg" mb={2}>
                        Billing & Subscription
                    </Heading>
                    <Text color="chakra-subtle-text">
                        Manage your team&apos;s premium subscription
                    </Text>
                </Box>

                {/* Content */}
                {!subscription ? (
                    <VStack spacing={6} align="stretch">
                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle>No Active Subscription</AlertTitle>
                                <AlertDescription>
                                    Upgrade to Premium to unlock Daily Sentiments and Health Checks for your team.
                                </AlertDescription>
                            </Box>
                        </Alert>

                        <UpgradeCard scopeId={numericScopeId} />
                    </VStack>
                ) : (
                    <Alert status="success" borderRadius="md">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Active Subscription</AlertTitle>
                            <AlertDescription>
                                Your team has an active Premium subscription. Subscription management will be available in the next update.
                            </AlertDescription>
                        </Box>
                    </Alert>
                )}
            </VStack>
        </Container>
    );
}
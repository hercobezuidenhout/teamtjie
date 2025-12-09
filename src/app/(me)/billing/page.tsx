'use client';

import {
    Container,
    Heading,
    Text,
    VStack,
    Box,
    Spinner,
    Alert,
    AlertIcon,
    Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useUserSubscriptionQuery } from '@/services/subscription/queries/use-user-subscription-query';
import { useCurrentUserQuery } from '@/services/user/queries/use-current-user-query';
import { useScopesQuery } from '@/services/scope/queries/use-scopes-query';
import { ManageTeamsCard } from './components/ManageTeamsCard';
import { SubscribeCard } from './components/SubscribeCard';

export default function UserBillingPage() {
    const router = useRouter();
    const { data: user, isLoading: userLoading } = useCurrentUserQuery();
    const { data: subscriptionData, isLoading: subscriptionLoading } = useUserSubscriptionQuery();
    const { data: scopes, isLoading: scopesLoading } = useScopesQuery();

    if (userLoading || subscriptionLoading || scopesLoading) {
        return (
            <Container maxW="container.lg" py={8}>
                <VStack spacing={4}>
                    <Spinner size="xl" color="chakra-primary-color" />
                    <Text color="chakra-subtle-text">Loading billing information...</Text>
                </VStack>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container maxW="container.lg" py={8}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Text>Unable to load user information</Text>
                </Alert>
            </Container>
        );
    }

    const hasSubscription = subscriptionData?.hasSubscription && subscriptionData.subscription;

    return (
        <Container maxW="container.lg" py={8}>
            <VStack spacing={8} align="stretch">
                {/* Header */}
                <Box>
                    <Heading size="lg" mb={2}>
                        Billing & Subscription
                    </Heading>
                    <Text color="chakra-subtle-text">
                        Manage your Teamtjie+ subscription and premium teams
                    </Text>
                </Box>

                {/* Subscription Management or Subscribe */}
                {hasSubscription ? (
                    <ManageTeamsCard
                        subscription={subscriptionData.subscription!}
                        externalSubscriptionId={subscriptionData.subscription?.externalSubscriptionId}
                    />
                ) : (
                    <SubscribeCard
                        userEmail={user.email || ''}
                        userName={user.name}
                        userScopes={scopes || []}
                    />
                )}
            </VStack>
        </Container>
    );
}

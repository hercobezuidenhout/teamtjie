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
    AlertTitle,
    AlertDescription
} from '@chakra-ui/react';
import { UpgradeCard } from './components/UpgradeCard';
import { TeamBillingStatus } from './components/TeamBillingStatus';
import { useCurrentUserQuery } from '@/services/user/queries/use-current-user-query';
import { useScopeQuery } from '@/services/scope/queries/use-scope-query';
import { useSubscriptionQuery } from '@/services/subscription/queries/use-subscription-query';
import { useUserSubscriptionQuery } from '@/services/subscription/queries/use-user-subscription-query';
import { useScopesQuery } from '@/services/scope/queries/use-scopes-query';

interface BillingPageProps {
    params: { scopeId: string; };
}

export default function BillingPage({ params }: BillingPageProps) {
    const { scopeId } = params;
    const numericScopeId = parseInt(scopeId, 10);

    const { data: user, isLoading: userLoading, error: userError } = useCurrentUserQuery();
    const { data: scope, isLoading: scopeLoading, error: scopeError } = useScopeQuery(numericScopeId);
    const { data: teamSubscriptionData, isLoading: teamSubscriptionLoading } = useSubscriptionQuery(numericScopeId);
    const { data: userSubscriptionData, isLoading: userSubscriptionLoading } = useUserSubscriptionQuery();
    const { data: scopes, isLoading: scopesLoading } = useScopesQuery();

    // Loading state
    if (userLoading || scopeLoading || teamSubscriptionLoading || userSubscriptionLoading || scopesLoading) {
        return (
            <Container maxW="container.lg" py={8}>
                <VStack spacing={4}>
                    <Spinner size="xl" color="chakra-primary-color" />
                    <Text color="chakra-subtle-text">Loading billing information...</Text>
                </VStack>
            </Container>
        );
    }

    // Error state
    if (userError || scopeError || !user || !scope) {
        return (
            <Container maxW="container.lg" py={8}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Unable to Load Billing Page</AlertTitle>
                        <AlertDescription>
                            {userError ? 'Failed to load user information. ' : ''}
                            {scopeError ? 'Failed to load team information. ' : ''}
                            {!user ? 'User not found. ' : ''}
                            {!scope ? 'Team not found. ' : ''}
                            Please try again or contact support.
                        </AlertDescription>
                    </Box>
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

                {/* Team Subscription Status */}
                <TeamBillingStatus
                    scopeId={numericScopeId}
                    scopeName={scope.name}
                    hasSubscription={teamSubscriptionData?.hasSubscription || false}
                    subscribedBy={teamSubscriptionData?.subscription?.subscribedBy}
                    userHasSubscription={userSubscriptionData?.hasSubscription || false}
                    userSubscriptionTeamCount={userSubscriptionData?.subscription?.teamCount || 0}
                />

                {/* Show upgrade card if user doesn't have subscription */}
                {!userSubscriptionData?.hasSubscription && (
                    <UpgradeCard
                        scopeId={numericScopeId}
                        scopeName={scope.name}
                        userEmail={user.email || ''}
                        userName={user.name}
                        userScopes={scopes || []}
                    />
                )}
            </VStack>
        </Container>
    );
}
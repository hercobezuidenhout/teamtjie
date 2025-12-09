'use client';

import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Icon,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { FiCheck, FiExternalLink, FiLock, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAddTeamMutation } from '@/services/subscription/mutations/use-add-team-mutation';
import { useToast } from '@chakra-ui/react';

interface TeamBillingStatusProps {
    scopeId: number;
    scopeName: string;
    hasSubscription: boolean;
    subscribedBy?: {
        id: string;
        name: string;
    } | null;
    userHasSubscription: boolean;
    userSubscriptionTeamCount?: number;
}

export function TeamBillingStatus({
    scopeId,
    scopeName,
    hasSubscription,
    subscribedBy,
    userHasSubscription,
    userSubscriptionTeamCount = 0,
}: TeamBillingStatusProps) {
    const router = useRouter();
    const addTeamMutation = useAddTeamMutation();
    const toast = useToast();

    const handleAddTeam = async () => {
        try {
            await addTeamMutation.mutateAsync({ scopeId });
            toast({
                title: 'Team Added',
                description: 'Premium features activated for this team.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.message || 'Failed to add team',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Team has premium via subscription
    if (hasSubscription && subscribedBy) {
        return (
            <Card>
                <CardHeader>
                    <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                            <Heading size="md">Premium Features</Heading>
                            <Text fontSize="sm" color="chakra-subtle-text">
                                Active on this team
                            </Text>
                        </VStack>
                        <Badge colorScheme="green" fontSize="sm">
                            ACTIVE
                        </Badge>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <VStack align="stretch" spacing={4}>
                        <HStack spacing={3}>
                            <Icon as={FiCheck} color="green.500" boxSize={6} />
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">Premium Enabled</Text>
                                <Text fontSize="sm" color="chakra-subtle-text">
                                    Part of {subscribedBy.name}&apos;s Teamtjie+ subscription
                                </Text>
                            </VStack>
                        </HStack>

                        <Button
                            colorScheme="blue"
                            variant="outline"
                            rightIcon={<Icon as={FiExternalLink} />}
                            onClick={() => router.push('/billing')}
                        >
                            Manage My Subscription
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        );
    }

    // User has subscription but team not added
    if (userHasSubscription && userSubscriptionTeamCount < 3) {
        return (
            <Card>
                <CardHeader>
                    <VStack align="start" spacing={1}>
                        <Heading size="md">Add to Your Subscription</Heading>
                        <Text fontSize="sm" color="chakra-subtle-text">
                            You have {3 - userSubscriptionTeamCount} slot{3 - userSubscriptionTeamCount !== 1 ? 's' : ''} available
                        </Text>
                    </VStack>
                </CardHeader>
                <CardBody>
                    <VStack align="stretch" spacing={4}>
                        <Text fontSize="sm">
                            Add this team to your Teamtjie+ subscription to enable premium features.
                        </Text>

                        <Button
                            colorScheme="blue"
                            leftIcon={<Icon as={FiPlus} />}
                            onClick={handleAddTeam}
                            isLoading={addTeamMutation.isPending}
                        >
                            Add This Team
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            rightIcon={<Icon as={FiExternalLink} />}
                            onClick={() => router.push('/billing')}
                        >
                            Manage All Teams
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        );
    }

    // User has subscription but at max capacity
    if (userHasSubscription && userSubscriptionTeamCount >= 3) {
        return (
            <Card>
                <CardHeader>
                    <VStack align="start" spacing={1}>
                        <Heading size="md">Subscription Full</Heading>
                        <Text fontSize="sm" color="chakra-subtle-text">
                            Maximum 3 teams reached
                        </Text>
                    </VStack>
                </CardHeader>
                <CardBody>
                    <VStack align="stretch" spacing={4}>
                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">
                                You&apos;ve reached the maximum of 3 teams. Remove a team to add this one.
                            </Text>
                        </Alert>

                        <Button
                            colorScheme="blue"
                            variant="outline"
                            rightIcon={<Icon as={FiExternalLink} />}
                            onClick={() => router.push('/billing')}
                        >
                            Manage Teams
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        );
    }

    // No subscription - show upgrade option
    return (
        <Card>
            <CardHeader>
                <VStack align="start" spacing={1}>
                    <Heading size="md">Upgrade to Teamtjie+</Heading>
                    <Text fontSize="sm" color="chakra-subtle-text">
                        R99/month • Up to 3 teams
                    </Text>
                </VStack>
            </CardHeader>
            <CardBody>
                <VStack align="stretch" spacing={4}>
                    <HStack spacing={3}>
                        <Icon as={FiLock} color="chakra-primary-color" boxSize={5} />
                        <Text fontSize="sm">
                            Subscribe to enable premium features for this team and up to 2 more teams.
                        </Text>
                    </HStack>

                    <Text fontSize="sm" color="chakra-subtle-text">
                        Continue below to subscribe and select your teams.
                    </Text>
                </VStack>
            </CardBody>
        </Card>
    );
}

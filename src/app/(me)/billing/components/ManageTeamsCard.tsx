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
    Divider,
    useToast,
    Icon,
    List,
    ListItem,
    IconButton,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { FiTrash2, FiPlus, FiCalendar, FiExternalLink } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAddTeamMutation } from '@/services/subscription/mutations/use-add-team-mutation';
import { useRemoveTeamMutation } from '@/services/subscription/mutations/use-remove-team-mutation';
import { useGetManagementLinkMutation } from '@/services/subscription/mutations/use-get-management-link-mutation';
import { useSyncSubscriptionMutation } from '@/services/subscription/mutations/use-sync-subscription-mutation';
import { useScopesQuery } from '@/services/scope/queries/use-scopes-query';

interface ManageTeamsCardProps {
    subscription: {
        id: number;
        status: string;
        amount: number;
        currency: string;
        currentPeriodEnd?: string | null;
        cancelAtPeriodEnd?: boolean;
        teams: Array<{
            id: number;
            scopeId: number;
            scopeName: string;
            addedAt: string;
        }>;
        teamCount: number;
    };
    externalSubscriptionId?: string | null;
}

export function ManageTeamsCard({ subscription, externalSubscriptionId }: ManageTeamsCardProps) {
    const toast = useToast();
    const { data: scopesData, isLoading: scopesLoading } = useScopesQuery();
    const addTeamMutation = useAddTeamMutation();
    const removeTeamMutation = useRemoveTeamMutation();
    const getManagementLinkMutation = useGetManagementLinkMutation();
    const syncMutation = useSyncSubscriptionMutation();

    const scopes = scopesData || [];

    // Filter teams where user is admin but not in subscription
    const availableTeams = scopes.filter(
        (scope) =>
            scope.roles.some((r) => r.role === 'ADMIN') &&
            !subscription.teams.some((t) => t.scopeId === scope.id)
    );

    const handleAddTeam = async (scopeId: number) => {
        try {
            await addTeamMutation.mutateAsync({ scopeId });
            toast({
                title: 'Team Added',
                description: 'Premium features activated for this team.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error: unknown) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to add team',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleRemoveTeam = async (scopeId: number) => {
        try {
            await removeTeamMutation.mutateAsync({ scopeId });
            toast({
                title: 'Team Removed',
                description: 'Premium features deactivated for this team.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to remove team',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleManageSubscription = async () => {
        try {
            const result = await getManagementLinkMutation.mutateAsync();

            if (result.success && result.link) {
                // Open Paystack management page in new tab
                window.open(result.link, '_blank');

                toast({
                    title: 'Opening Management Page',
                    description: 'Manage your subscription on Paystack\'s secure page.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(result.message || 'Failed to get management link');
            }
        } catch (error: unknown) {
            toast({
                title: 'Unable to Open Management Page',
                description: error instanceof Error ? error.message : 'Please try again or contact support if the issue persists.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleSyncSubscription = async () => {
        try {
            const result = await syncMutation.mutateAsync();
            toast({
                title: 'Sync Successful',
                description: 'Subscription linked to Paystack for recurring billing.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error: unknown) {
            toast({
                title: 'Sync Failed',
                description: error instanceof Error ? error.message : 'Could not sync with Paystack',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const needsSync = !externalSubscriptionId;

    return (
        <>
        {needsSync && (
            <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={2} flex={1}>
                    <Text fontWeight="bold" fontSize="sm">
                        Subscription Not Linked
                    </Text>
                    <Text fontSize="sm">
                        Your subscription is active but not linked to Paystack for recurring billing. Click below to fix this.
                    </Text>
                    <Button
                        size="sm"
                        colorScheme="orange"
                        onClick={handleSyncSubscription}
                        isLoading={syncMutation.isPending}
                    >
                        Sync with Paystack
                    </Button>
                </VStack>
            </Alert>
        )}

        <Card>
            <CardHeader>
                <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                        <Heading size="md">Teamtjie+ Subscription</Heading>
                        <Text fontSize="sm" color="chakra-subtle-text">
                            Manage your premium teams
                        </Text>
                    </VStack>
                    <Badge colorScheme="green" fontSize="sm">
                        {subscription.status}
                    </Badge>
                </HStack>
            </CardHeader>

            <CardBody>
                <VStack align="stretch" spacing={6}>
                    {/* Pricing */}
                    <VStack spacing={2}>
                        <HStack spacing={1} align="baseline">
                            <Text fontSize="4xl" fontWeight="bold" color="chakra-primary-color">
                                R{subscription.amount}
                            </Text>
                            <Text color="chakra-subtle-text">/month</Text>
                        </HStack>
                        {subscription.currentPeriodEnd && (
                            <HStack spacing={2} color="chakra-subtle-text">
                                <Icon as={FiCalendar} boxSize={4} />
                                <Text fontSize="sm">
                                    Next billing: {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                                </Text>
                            </HStack>
                        )}
                    </VStack>

                    <Divider />

                    {/* Premium Teams */}
                    <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                            <Heading size="sm">Premium Teams</Heading>
                            <Badge colorScheme="blue" fontSize="sm">
                                {subscription.teamCount}/3
                            </Badge>
                        </HStack>

                        {subscription.teams.length > 0 ? (
                            <List spacing={2}>
                                {subscription.teams.map((team) => (
                                    <ListItem key={team.id}>
                                        <HStack
                                            p={3}
                                            borderWidth="1px"
                                            borderRadius="md"
                                            justify="space-between"
                                        >
                                            <VStack align="start" spacing={0}>
                                                <Text fontWeight="medium">{team.scopeName}</Text>
                                                <Text fontSize="xs" color="chakra-subtle-text">
                                                    Added {format(new Date(team.addedAt), 'MMM d, yyyy')}
                                                </Text>
                                            </VStack>
                                            <IconButton
                                                aria-label="Remove team"
                                                icon={<Icon as={FiTrash2} />}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                                onClick={() => handleRemoveTeam(team.scopeId)}
                                                isLoading={removeTeamMutation.isPending}
                                            />
                                        </HStack>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Text color="chakra-subtle-text" fontSize="sm" py={4} textAlign="center">
                                No teams added yet. Add teams below to activate premium features.
                            </Text>
                        )}
                    </VStack>

                    {/* Available Teams */}
                    {availableTeams.length > 0 && subscription.teamCount < 3 && (
                        <>
                            <Divider />
                            <VStack align="stretch" spacing={3}>
                                <Heading size="sm">Available Teams ({availableTeams.length})</Heading>
                                <List spacing={2}>
                                    {availableTeams.map((team) => (
                                        <ListItem key={team.id}>
                                            <HStack
                                                p={3}
                                                borderWidth="1px"
                                                borderRadius="md"
                                                justify="space-between"
                                            >
                                                <Text fontWeight="medium">{team.name}</Text>
                                                <Button
                                                    size="sm"
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    leftIcon={<Icon as={FiPlus} />}
                                                    onClick={() => handleAddTeam(team.id)}
                                                    isLoading={addTeamMutation.isPending}
                                                >
                                                    Add
                                                </Button>
                                            </HStack>
                                        </ListItem>
                                    ))}
                                </List>
                            </VStack>
                        </>
                    )}

                    {subscription.teamCount >= 3 && availableTeams.length > 0 && (
                        <Text fontSize="sm" color="orange.500" textAlign="center">
                            Maximum 3 teams reached. Remove a team to add another.
                        </Text>
                    )}

                    <Divider />

                    {/* Manage Subscription */}
                    <VStack spacing={3}>
                        <Button
                            colorScheme="blue"
                            variant="outline"
                            size="md"
                            w="full"
                            onClick={handleManageSubscription}
                            leftIcon={<Icon as={FiExternalLink} />}
                            isLoading={getManagementLinkMutation.isPending}
                        >
                            Manage Subscription on Paystack
                        </Button>
                        <Text fontSize="xs" color="chakra-subtle-text" textAlign="center">
                            Cancel, update payment method, or view billing history on Paystack&apos;s secure page.
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
        </>
    );
}

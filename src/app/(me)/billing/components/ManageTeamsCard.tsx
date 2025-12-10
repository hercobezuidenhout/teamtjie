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
import { FiTrash2, FiPlus, FiExternalLink } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAddTeamMutation } from '@/services/subscription/mutations/use-add-team-mutation';
import { useRemoveTeamMutation } from '@/services/subscription/mutations/use-remove-team-mutation';
import { useGetManagementLinkMutation } from '@/services/subscription/mutations/use-get-management-link-mutation';
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

export function ManageTeamsCard({ subscription }: ManageTeamsCardProps) {
    const toast = useToast();
    const { data: scopesData } = useScopesQuery();
    const addTeamMutation = useAddTeamMutation();
    const removeTeamMutation = useRemoveTeamMutation();
    const getManagementLinkMutation = useGetManagementLinkMutation();

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

            if (!result) {
                throw new Error('Failed to get management link');
            }

            if (result.success && result.link) {
                window.open(result.link, '_blank');

                toast({
                    title: 'Opening Management Page',
                    description: 'Manage your subscription settings.',
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
                description: error instanceof Error ? error.message : 'Please try again or contact support.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            {subscription.cancelAtPeriodEnd && (
                <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="bold" fontSize="sm">
                            Subscription Ending Soon
                        </Text>
                        <Text fontSize="sm">
                            Your subscription will end on {subscription.currentPeriodEnd ? format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy') : 'the end of the billing period'}.
                            Premium features will be deactivated after this date.
                        </Text>
                    </VStack>
                </Alert>
            )}

            <Card>
                <CardHeader pb={2}>
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={0}>
                            <Heading size="sm">Teamtjie+</Heading>
                            <HStack spacing={2} mt={1}>
                                <Text fontSize="md" fontWeight="semibold">
                                    R{subscription.amount}/mo
                                </Text>
                                {subscription.currentPeriodEnd && (
                                    <Text fontSize="xs" color="chakra-subtle-text">
                                        • Next: {format(new Date(subscription.currentPeriodEnd), 'MMM d')}
                                    </Text>
                                )}
                            </HStack>
                        </VStack>
                        <Badge
                            colorScheme={subscription.cancelAtPeriodEnd ? "orange" : "green"}
                            fontSize="xs"
                        >
                            {subscription.cancelAtPeriodEnd ? "ENDING" : subscription.status}
                        </Badge>
                    </HStack>
                </CardHeader>

                <CardBody pt={2}>
                    <VStack align="stretch" spacing={3}>
                        {/* Premium Teams */}
                        <VStack align="stretch" spacing={2}>
                            <HStack justify="space-between">
                                <Text fontSize="sm" fontWeight="medium">Premium Teams</Text>
                                <Text fontSize="xs" color="chakra-subtle-text">
                                    {subscription.teamCount}/3
                                </Text>
                            </HStack>

                            {subscription.teams.length > 0 && (
                                <List spacing={1}>
                                    {subscription.teams.map((team) => (
                                        <ListItem key={team.id}>
                                            <HStack
                                                p={2}
                                                borderWidth="1px"
                                                borderRadius="md"
                                                justify="space-between"
                                                bg="chakra-subtle-bg"
                                            >
                                                <Text fontSize="sm">{team.scopeName}</Text>
                                                <IconButton
                                                    aria-label="Remove team"
                                                    icon={<Icon as={FiTrash2} />}
                                                    size="xs"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveTeam(team.scopeId)}
                                                    isLoading={removeTeamMutation.isPending}
                                                />
                                            </HStack>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </VStack>

                        {/* Available Teams */}
                        {availableTeams.length > 0 && subscription.teamCount < 3 && (
                            <>
                                <Divider />
                                <VStack align="stretch" spacing={2}>
                                    <Text fontSize="sm" fontWeight="medium">Add Teams</Text>
                                    <List spacing={1}>
                                        {availableTeams.map((team) => (
                                            <ListItem key={team.id}>
                                                <HStack
                                                    p={2}
                                                    borderWidth="1px"
                                                    borderRadius="md"
                                                    justify="space-between"
                                                >
                                                    <Text fontSize="sm">{team.name}</Text>
                                                    <Button
                                                        size="xs"
                                                        colorScheme="blue"
                                                        leftIcon={<Icon as={FiPlus} boxSize={3} />}
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
                            <Text fontSize="xs" color="orange.500">
                                Maximum 3 teams reached
                            </Text>
                        )}

                        <Divider />

                        {/* Manage Subscription */}
                        <Button
                            variant="outline"
                            size="sm"
                            w="full"
                            onClick={handleManageSubscription}
                            rightIcon={<Icon as={FiExternalLink} boxSize={3} />}
                            isLoading={getManagementLinkMutation.isPending}
                        >
                            Manage Subscription
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </>
    );
}

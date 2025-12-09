'use client';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    Text,
    Checkbox,
    HStack,
    Badge,
    useToast,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAddTeamMutation } from '@/services/subscription/mutations/use-add-team-mutation';

interface Team {
    id: number;
    name: string;
    type: string;
}

interface TeamSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    teams: Team[];
    contextScopeId?: number;
}

export function TeamSelectionModal({
    isOpen,
    onClose,
    teams,
    contextScopeId,
}: TeamSelectionModalProps) {
    const [selectedTeams, setSelectedTeams] = useState<number[]>(
        contextScopeId ? [contextScopeId] : []
    );
    const toast = useToast();
    const addTeamMutation = useAddTeamMutation();

    const toggleTeam = (scopeId: number) => {
        setSelectedTeams((prev) =>
            prev.includes(scopeId)
                ? prev.filter((id) => id !== scopeId)
                : prev.length < 3
                ? [...prev, scopeId]
                : prev
        );
    };

    const handleActivate = async () => {
        if (selectedTeams.length === 0) {
            toast({
                title: 'Select at least one team',
                description: 'Choose up to 3 teams to activate premium features.',
                status: 'warning',
                duration: 4000,
                isClosable: true,
            });
            return;
        }

        try {
            // Add all selected teams
            for (const scopeId of selectedTeams) {
                await addTeamMutation.mutateAsync({ scopeId });
            }

            toast({
                title: 'Premium Activated!',
                description: `${selectedTeams.length} team${
                    selectedTeams.length > 1 ? 's' : ''
                } now have premium features.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            onClose();

            // Reload to refresh all subscription states
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error adding teams:', error);
            toast({
                title: 'Error',
                description: 'Failed to activate teams. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Select Teams for Premium Features
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack align="stretch" spacing={4}>
                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">
                                Choose up to 3 teams where you&apos;re an admin. You can change this later.
                            </Text>
                        </Alert>

                        <HStack justify="space-between">
                            <Text fontWeight="medium">
                                Select Teams
                            </Text>
                            <Badge colorScheme="blue" fontSize="sm">
                                {selectedTeams.length}/3 Selected
                            </Badge>
                        </HStack>

                        {teams.length === 0 ? (
                            <Text color="chakra-subtle-text" py={4} textAlign="center">
                                No teams found where you&apos;re an admin.
                            </Text>
                        ) : (
                            <VStack align="stretch" spacing={2}>
                                {teams.map((team) => (
                                    <HStack
                                        key={team.id}
                                        p={3}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        cursor="pointer"
                                        onClick={() => toggleTeam(team.id)}
                                        _hover={{ backgroundColor: 'chakra-subtle-bg' }}
                                        backgroundColor={
                                            selectedTeams.includes(team.id)
                                                ? 'chakra-primary-color-soft'
                                                : undefined
                                        }
                                    >
                                        <Checkbox
                                            isChecked={selectedTeams.includes(team.id)}
                                            onChange={() => toggleTeam(team.id)}
                                            isDisabled={
                                                !selectedTeams.includes(team.id) && selectedTeams.length >= 3
                                            }
                                        />
                                        <VStack align="start" spacing={0} flex={1}>
                                            <Text fontWeight="medium">{team.name}</Text>
                                            <Text fontSize="xs" color="chakra-subtle-text">
                                                {team.type}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                ))}
                            </VStack>
                        )}

                        {selectedTeams.length === 3 && (
                            <Text fontSize="sm" color="orange.500">
                                Maximum 3 teams reached. Uncheck a team to select another.
                            </Text>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Skip for Now
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleActivate}
                        isLoading={addTeamMutation.isPending}
                        isDisabled={selectedTeams.length === 0}
                    >
                        Activate Premium
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

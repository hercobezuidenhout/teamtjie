'use client';

import { VStackStretch } from "@/lib/layout/VStackStretch";
import { Card, CardBody, CardFooter, CardHeader, Flex, HStack, Heading, Icon, IconButton, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { BackToAccountButton } from "../components/BackToAccountButton/BackToAccountButton";
import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { FaMicrosoft } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { ConfirmationModal } from "@/lib/modals/ConfirmationModal/ConfirmationModal";
import { UserIdentity } from "@supabase/supabase-js";
import { EmptyStateCard } from "@/lib/cards/EmptyStateCard/EmptyStateCard";

const Page = () => {
    const { auth } = useSupabaseClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedIdentity, setSelectedIdentity] = useState<UserIdentity>();
    const toast = useToast();

    const [user, setUser] = useState<User>();

    const refreshUser = () => auth
        .getUser()
        .then(({ data }) => {
            setUser(data.user ?? undefined);
        });

    const handleClick = (identity: UserIdentity) => {
        console.info(identity);
        setSelectedIdentity(identity);
        onOpen();
    };

    const handleConfirm = async () => {
        onClose();

        if (!selectedIdentity) {
            return;
        }

        const { error } = await auth.unlinkIdentity(selectedIdentity);

        if (error) {
            toast({ title: error.message, variant: 'error', icon: '🥲' });
        } else {
            refreshUser();
            toast({
                title: 'Provider Removed',
                description: `The ${selectedIdentity.provider} has successfully been removed.`,
                variant: 'success',
                duration: 2000,
                icon: '🤘'
            });
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <>
            <VStackStretch gap={2}>
                <BackToAccountButton />
                <Card>
                    <CardHeader>
                        <Heading>Manage Providers</Heading>
                    </CardHeader>
                    <CardBody py={0}>
                        <VStackStretch gap={3}>
                            {user?.identities && user?.identities?.filter(identity => identity.provider !== 'email').length < 1 && (
                                <EmptyStateCard />
                            )}
                            {user?.identities?.filter(identity => identity.provider !== 'email')
                                .map(identity => (
                                    <HStack key={identity.id} borderRadius="md" pr={2} justifyContent="space-between" transition="0.3s">
                                        <HStack gap={3}>
                                            <Flex backgroundColor="chakra-subtle-bg" padding="3" borderRadius="md">
                                                <Icon as={FaMicrosoft} />
                                            </Flex>
                                            <VStackStretch>
                                                <Text fontWeight="bold" textTransform="capitalize">{identity.provider}</Text>
                                                {identity.last_sign_in_at && <Text fontSize="xs" color="chakra-subtle-text">Last Sign In: {new Date(identity.last_sign_in_at).toLocaleDateString()}</Text>}
                                            </VStackStretch>
                                        </HStack>
                                        <IconButton onClick={() => handleClick(identity)} aria-label="Remove provider" variant="ghost" icon={<Icon as={FiTrash} />} />
                                    </HStack>
                                ))}
                        </VStackStretch>
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </Card>
            </VStackStretch>
            <ConfirmationModal isOpen={isOpen} onCancel={onClose} onConfirm={handleConfirm} />
        </>
    );
};

export default Page;
'use client';

import { useAbilities } from "@/contexts/AbilityContextProvider";
import { UpdateAvatarModal } from "@/lib/modals/UpdateAvatarModal/UpdateAvatarModal";
import { subject } from "@casl/ability";
import { Avatar, useDisclosure } from "@chakra-ui/react";
import { Scope } from "@prisma/client";

interface ScopeLogoProps {
    scope: Scope;
}

export const ScopeLogo = ({ scope }: ScopeLogoProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const abilities = useAbilities();

    const handleClick = () => {
        if (abilities.can('edit', subject('Scope', { id: scope.id }))) {
            onOpen();
        }
    };

    return (
        <>
            <Avatar onClick={handleClick} name={scope.name} src={scope.image ?? undefined} size="lg" cursor="pointer" transition="0.3s" _hover={{
                opacity: 0.8
            }} />
            <UpdateAvatarModal isOpen={isOpen} onClose={onClose} profileId={scope.id} profileType="SCOPE" />
        </>
    );
};
'use client';

import { EditScopeProfileModal } from "@/lib/modals/EditScopeProfileModal/EditScopeProfileModal";
import { Button, useDisclosure } from "@chakra-ui/react";
import { Scope } from "@prisma/client";

interface EditScopeProfileButtonProps {
    scope: Scope;
}

export const EditScopeProfileButton = ({ scope }: EditScopeProfileButtonProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button onClick={onOpen}>Edit Charter</Button>
            <EditScopeProfileModal isOpen={isOpen} onClose={onClose} scope={scope} />
        </>
    );
};